from pydantic import BaseModel
from datetime import date

class UserCreate(BaseModel):
    username: str
    password: str

class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category: str
    date: date

class ExpenseResponse(ExpenseCreate):
    id: int

    class Config:
        from_attributes = True
