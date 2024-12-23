from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class BookBase(BaseModel):
    title: str
    author: str
    year: Optional[int] = None
    genre: Optional[str] = None
    file_path: Optional[str] = None

class BookCreate(BookBase):
    pass

class Book(BookBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ReadingSessionBase(BaseModel):
    book_id: int
    start_time: datetime
    end_time: datetime
    start_page: Optional[int] = None
    end_page: Optional[int] = None
    reading_format: str
    comprehension_rating: Optional[int] = None
    notes: Optional[str] = None
    location: Optional[str] = None
    energy_level: Optional[int] = None
    distractions: Optional[bool] = None

class ReadingSessionCreate(ReadingSessionBase):
    pass

class ReadingSession(ReadingSessionBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class Stats(BaseModel):
    total_reading_minutes: int
    pages_per_book: List[dict]
    reading_by_location: List[dict]