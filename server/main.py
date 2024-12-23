from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from models import Book, ReadingSession
from database import get_session, init_db
from datetime import datetime

app = FastAPI()

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/api/books", response_model=List[Book])
def get_books(session: Session = Depends(get_session)):
    return session.exec(select(Book)).all()

@app.get("/api/books/{book_id}", response_model=Book)
def get_book(book_id: int, session: Session = Depends(get_session)):
    book = session.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@app.get("/api/books/search/{query}", response_model=List[Book])
def search_books(query: str, session: Session = Depends(get_session)):
    books = session.exec(
        select(Book).where(
            (Book.title.contains(query)) | 
            (Book.author.contains(query))
        )
    ).all()
    return books

@app.post("/api/sessions", response_model=ReadingSession)
def create_session(session_data: ReadingSession, db: Session = Depends(get_session)):
    session = ReadingSession.from_orm(session_data)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@app.get("/api/sessions", response_model=List[ReadingSession])
def get_sessions(session: Session = Depends(get_session)):
    return session.exec(select(ReadingSession)).all()

@app.get("/api/stats")
def get_stats(session: Session = Depends(get_session)):
    # Total reading time
    reading_sessions = session.exec(select(ReadingSession)).all()
    total_minutes = sum(
        (rs.end_time - rs.start_time).total_seconds() / 60 
        for rs in reading_sessions
    )

    # Pages per book
    books = session.exec(select(Book)).all()
    pages_per_book = []
    for book in books:
        pages = sum(
            rs.end_page - rs.start_page 
            for rs in book.reading_sessions 
            if rs.end_page and rs.start_page
        )
        if pages > 0:
            pages_per_book.append({"title": book.title, "pages_read": pages})

    # Reading by location
    location_counts = {}
    for rs in reading_sessions:
        if rs.location:
            location_counts[rs.location] = location_counts.get(rs.location, 0) + 1

    return {
        "total_reading_minutes": int(total_minutes),
        "pages_per_book": pages_per_book,
        "reading_by_location": [
            {"location": loc, "count": count} 
            for loc, count in location_counts.items()
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)