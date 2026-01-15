from xmlrpc.client import Boolean
from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy import Boolean
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    # email = Column(String, unique=True, index=True, nullable=False)
    expenses = relationship("Expense", back_populates="owner")

    # adding admin field
    is_admin=Column(Boolean, default=False)  #false by default true for admin users
    # need to update the sql db accordingly ---??
class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    date = Column(Date, nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="expenses")
