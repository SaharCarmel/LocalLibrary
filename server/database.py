from sqlmodel import SQLModel, create_engine, Session
from models import Book, ReadingSession
import os

DATABASE_URL = "sqlite:///library.db"
engine = create_engine(DATABASE_URL)

def get_session():
    with Session(engine) as session:
        yield session

def init_db():
    SQLModel.metadata.create_all(engine)