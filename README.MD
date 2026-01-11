# 📊 Expense Tracker – Full Stack Application

A **full-stack expense tracking application** built with **FastAPI, PostgreSQL, React, and Docker**, supporting **secure authentication**, **multi-user expense management**, analytics, and CI/CD.

---

## 🚀 Features

### 🔐 Authentication
- User registration & login
- Secure password hashing using bcrypt
- JWT-based authentication with **HttpOnly cookies**
- Session persistence across page refresh

### 👥 Multi-User Support
- Each user has isolated expenses
- Authorization enforced at API & database level

### 💰 Expense Management
- Add, edit, delete expenses
- Expense categories (Food, Travel, Rent, etc.)
- Date-based tracking

### 📊 Analytics & Insights
- Monthly expense summary
- Category-wise totals
- Visual charts (Pie / Bar)

### 📤 Export
- Export expenses to **Excel (.xlsx)**
- Includes:
  - Full expense list
  - Category summary
  - Total expense

### 🐳 DevOps Ready
- Dockerized backend
- PostgreSQL container
- GitHub Actions CI pipeline

---

## 🛠️ Tech Stack

### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy ORM
- JWT Authentication
- Docker

### Frontend
- React
- Axios
- Material UI
- Recharts

### DevOps
- Docker Compose
- GitHub Actions (CI)

---

## 📂 Project Structure

