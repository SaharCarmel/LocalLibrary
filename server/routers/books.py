from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from models import Book
from database import get_session
from pydantic import BaseModel

router = APIRouter(prefix="/api/books", tags=["books"])

class BookStatusUpdate(BaseModel):
    status: str

@router.get("", response_model=List[Book])
def get_books(session: Session = Depends(get_session)):
    statement = select(Book)
    return session.execute(statement).scalars().all()

@router.get("/{book_id}", response_model=Book)
def get_book(book_id: int, session: Session = Depends(get_session)):
    book = session.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.get("/search/{query}", response_model=List[Book])
def search_books(query: str, session: Session = Depends(get_session)):
    books = session.execute(
        select(Book).where(
            (Book.title.contains(query)) | 
            (Book.author.contains(query))
        )
    ).scalars().all()
    return books

@router.put("/{book_id}/status", response_model=Book)
def update_book_status(book_id: int, status_update: BookStatusUpdate, session: Session = Depends(get_session)):
    try:
        stmt = select(Book).where(Book.id == book_id)
        book = session.execute(stmt).scalar_one_or_none()
        
        if not book:
            raise HTTPException(status_code=404, detail=f"Book with ID {book_id} not found")
        
        book.status = status_update.status
        session.add(book)
        session.commit()
        session.refresh(book)
        
        return book
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{book_id}/complete")
def mark_book_completed(book_id: int, session: Session = Depends(get_session)):
    book = session.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    book.status = "completed"
    book.progress = 100
    session.add(book)
    session.commit()
    session.refresh(book)
    
    return {"message": "Book marked as completed", "book": book}
