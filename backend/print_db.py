"""
Standalone script to print expense database contents to console in tabular format
Run this directly: python print_db.py
"""

import logging
from backend import models
from sqlalchemy import event
from database import SessionLocal, engine, Base
from models import User, Expense
from tabulate import tabulate
models.Base.metadata.create_all(bind=engine)
# Enable SQL logging
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

# Capture SQL commands
sql_commands = []

@event.listens_for(engine, "before_cursor_execute")
def receive_before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    sql_commands.append(statement)

def print_database():
    """Print all users and their expenses from the database in tabular format"""
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # Get database session
    db = SessionLocal()
    
    try:
        print("\n" + "="*100)
        print("EXPENSE DATABASE CONTENTS")
        print("="*100)
        
        # Get all users
        users = db.query(User).all()
        
        if not users:
            print("\n[No users found in database]\n")
        else:
            # Print users table
            print("\n\n📋 USERS TABLE")
            print("-"*100)
            users_data = []
            for user in users:
                users_data.append([user.id, user.username])
            print(tabulate(users_data, headers=["User ID", "Username"], tablefmt="grid", numalign="center"))
            
            # Print expenses table
            print("\n\n💰 EXPENSES TABLE")
            print("-"*100)
            all_expenses = db.query(Expense).all()
            
            if not all_expenses:
                print("[No expenses found in database]\n")
            else:
                expenses_data = []
                for expense in all_expenses:
                    user = db.query(User).filter(User.id == expense.user_id).first()
                    username = user.username if user else "Unknown"
                    expenses_data.append([
                        expense.id,
                        username,
                        expense.title,
                        f"${expense.amount:.2f}",
                        expense.category,
                        str(expense.date)
                    ])
                print(tabulate(expenses_data, 
                             headers=["Expense ID", "Username", "Title", "Amount", "Category", "Date"], 
                             tablefmt="grid",
                             numalign="right"))
            
            # Print expenses by user
            print("\n\n👤 EXPENSES BY USER")
            print("-"*100)
            for user in users:
                expenses = db.query(Expense).filter(Expense.user_id == user.id).all()
                print(f"\n{user.username} (User ID: {user.id})")
                if not expenses:
                    print("  [No expenses]")
                else:
                    exp_data = []
                    for expense in expenses:
                        exp_data.append([
                            expense.id,
                            expense.title,
                            f"${expense.amount:.2f}",
                            expense.category,
                            str(expense.date)
                        ])
                    print(tabulate(exp_data,
                                 headers=["ID", "Title", "Amount", "Category", "Date"],
                                 tablefmt="simple",
                                 numalign="right"))
        
        # Print summary statistics
        total_users = db.query(User).count()
        total_expenses = db.query(Expense).count()
        total_amount = sum([e.amount for e in db.query(Expense).all()]) if total_expenses > 0 else 0
        
        print("\n\n📊 SUMMARY STATISTICS")
        print("-"*100)
        summary_data = [
            ["Total Users", total_users],
            ["Total Expenses", total_expenses],
            ["Total Amount Spent", f"${total_amount:.2f}"],
            ["Average Expense", f"${total_amount/total_expenses:.2f}" if total_expenses > 0 else "$0.00"]
        ]
        print(tabulate(summary_data, headers=["Metric", "Value"], tablefmt="grid", numalign="right"))
        print("="*100 + "\n")
        
    except Exception as e:
        print(f"\nError reading database: {e}\n")
    finally:
        db.close()

if __name__ == "__main__":
    print_database()
