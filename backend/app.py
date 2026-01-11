import token
from urllib import response
from fastapi import FastAPI, Depends, HTTPException, Response, Body
from sqlalchemy.orm import Session
from sqlalchemy import extract, func
from fastapi.middleware.cors import CORSMiddleware

from database import engine, get_db
import models, schemas
from auth import hash_password, verify_password, create_access_token
from dependencies import get_current_user
import os


models.Base.metadata.create_all(bind=engine)
IS_PRODUCTION = os.getenv("ENV") == "production"

app = FastAPI(title="Expense Tracker API")

# ------------------------
# CORS (REQUIRED FOR COOKIES)
# ------------------------
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",          # local dev
        "https://expense-tracker-inky-delta-53.vercel.app"  # 🔴 VERCEL URL
    ],
    allow_credentials=True,  # 🔴 REQUIRED for cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------
# Create tables
# ------------------------
models.Base.metadata.create_all(bind=engine)

# ------------------------
# Root
# ------------------------
@app.get("/")
def root():
    return {"message": "Expense Tracker API running 🚀"}

# =========================================================
# AUTH ROUTES
# =========================================================

@app.post("/auth/register")
def register(
    user: schemas.UserCreate = Body(...),
    db: Session = Depends(get_db)
):
    username = user.username.strip().lower()
    existing = db.query(models.User).filter(
        models.User.username == username
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    new_user = models.User(
        username=username,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()

    return {"message": "User registered successfully"}


@app.post("/auth/login")
def login(
    user: schemas.UserCreate,
    response: Response,
    db: Session = Depends(get_db)
):
    username = user.username.strip().lower()

    db_user = db.query(models.User).filter(
        models.User.username == username
    ).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(db_user.id)})

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=IS_PRODUCTION,  # 🔴 HTTPS only in prod
        samesite="none" if IS_PRODUCTION else "lax",
    )
    return {"message": "Login successful"}

# =========================================================
# EXPENSE ROUTES (ALL PROTECTED)
# =========================================================

@app.post("/expenses", response_model=schemas.ExpenseResponse)
def create_expense(
    expense: schemas.ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    new_expense = models.Expense(
        title=expense.title,
        amount=expense.amount,
        category=expense.category,
        date=expense.date,
        user_id=current_user.id
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense


@app.get("/expenses", response_model=list[schemas.ExpenseResponse])
def get_expenses(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return (
        db.query(models.Expense)
        .filter(models.Expense.user_id == current_user.id)
        .all()
    )


@app.put("/expenses/{expense_id}", response_model=schemas.ExpenseResponse)
def update_expense(
    expense_id: int,
    expense: schemas.ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_expense = (
        db.query(models.Expense)
        .filter(
            models.Expense.id == expense_id,
            models.Expense.user_id == current_user.id
        )
        .first()
    )

    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    db_expense.title = expense.title
    db_expense.amount = expense.amount
    db_expense.category = expense.category
    db_expense.date = expense.date

    db.commit()
    db.refresh(db_expense)
    return db_expense


@app.delete("/expenses/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_expense = (
        db.query(models.Expense)
        .filter(
            models.Expense.id == expense_id,
            models.Expense.user_id == current_user.id
        )
        .first()
    )

    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    db.delete(db_expense)
    db.commit()
    return {"message": "Expense deleted successfully"}

# =========================================================
# SUMMARY ROUTES (USER-SCOPED)
# =========================================================

@app.get("/expenses/summary/monthly")
def monthly_summary(
    month: int,
    year: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    total = (
        db.query(func.sum(models.Expense.amount))
        .filter(
            extract("month", models.Expense.date) == month,
            extract("year", models.Expense.date) == year,
            models.Expense.user_id == current_user.id
        )
        .scalar()
    )

    return {"month": month, "year": year, "total": total or 0}


@app.get("/expenses/summary/category")
def category_summary(
    month: int,
    year: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    data = (
        db.query(models.Expense.category, func.sum(models.Expense.amount))
        .filter(
            extract("month", models.Expense.date) == month,
            extract("year", models.Expense.date) == year,
            models.Expense.user_id == current_user.id
        )
        .group_by(models.Expense.category)
        .all()
    )

    return [{"category": c, "total": t} for c, t in data]


@app.post("/auth/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out"}


@app.get("/auth/me")
def get_current_user_info(
    current_user: models.User = Depends(get_current_user)
):
    return {"username": current_user.username, "id": current_user.id}
