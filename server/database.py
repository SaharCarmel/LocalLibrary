from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlmodel import SQLModel
import os

# Update engine creation with check_same_thread=False
engine = create_engine(
    "sqlite:///./library.db",
    connect_args={"check_same_thread": False}
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get database session
def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def init_db():
    SQLModel.metadata.create_all(engine)