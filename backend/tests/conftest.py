import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app import app
from database import Base, get_db

# TEST_DATABASE_URL = "postgresql://expense_user:Test4321@localhost:5432/expense_tracker"
TEST_DATABASE_URL = "postgresql://expense_tracker_bs9p_user:e7MU7hBL6KLfdmqPEOFRfHbvGltTi8Rt@dpg-d5homf95pdvs73bjo2d0-a.virginia-postgres.render.com/expense_tracker_bs9p"
engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture()
def db():
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()

@pytest.fixture()
def client(db):
    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)
