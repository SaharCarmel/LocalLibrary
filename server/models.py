from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

class BookBase(SQLModel):
    title: str
    author: str
    year: Optional[int] = None
    genre: Optional[str] = None
    file_path: Optional[str] = None
    pages: Optional[int] = None
    progress: Optional[int] = None
    completed_date: Optional[datetime] = None
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    language: Optional[str] = None
    format: Optional[str] = None
    source: Optional[str] = None
    notes: Optional[str] = None

class Book(BookBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    reading_sessions: List["ReadingSession"] = Relationship(back_populates="book")
    status: Optional[str] = None

class ReadingSessionBase(SQLModel):
    book_id: Optional[int] = Field(default=None, foreign_key="book.id")
    start_time: datetime
    end_time: datetime
    start_page: Optional[int] = None
    end_page: Optional[int] = None
    reading_format: str
    comprehension_rating: Optional[int] = Field(default=None, ge=1, le=5)
    notes: Optional[str] = None
    location: Optional[str] = None
    energy_level: Optional[int] = Field(default=None, ge=1, le=5)
    distractions: Optional[bool] = None

class ReadingSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    book_id: int = Field(foreign_key="book.id")
    start_time: datetime
    end_time: datetime
    start_page: Optional[int] = None
    end_page: Optional[int] = None
    location: Optional[str] = None
    book: "Book" = Relationship(back_populates="reading_sessions")