from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from models import ReadingSession, Book
from database import get_session

router = APIRouter(prefix="/api/sessions", tags=["sessions"])

@router.post("", response_model=ReadingSession)
def create_session(session_data: ReadingSession, db: Session = Depends(get_session)):
    session = ReadingSession.from_orm(session_data)
    db.add(session)
    db.commit()
    db.refresh(session)
    
    calculate_books_progress(db)
    
    return session

@router.get("", response_model=List[ReadingSession])
def get_sessions(session: Session = Depends(get_session)):
    return session.execute(select(ReadingSession)).scalars().all()

@router.post("/calculate-progress")
def calculate_books_progress(session: Session = Depends(get_session)):
    books = session.execute(select(Book)).scalars().all()
    reading_sessions = session.execute(select(ReadingSession)).scalars().all()
    
    book_progress = {}
    
    for reading_session in reading_sessions:
        if reading_session.book_id not in book_progress:
            book_progress[reading_session.book_id] = 0
        book_progress[reading_session.book_id] += reading_session.end_page - reading_session.start_page
    
    updated_books = []
    for book in books:
        if book.id in book_progress:
            progress = min(100, round((book_progress[book.id] / book.pages) * 100))
            book.progress = progress
            if progress == 100:
                book.status = "completed"
            elif progress > 0:
                book.status = "in_progress"
            session.add(book)
            updated_books.append({
                "id": book.id,
                "progress": progress,
                "status": book.status
            })
    
    session.commit()
    return {"updated_books": updated_books}
