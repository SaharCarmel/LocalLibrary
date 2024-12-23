from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from typing import List
from models import Book, ReadingSession
from database import get_session, init_db
from datetime import datetime

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
async def root():
    return {"message": "Welcome to Library Analytics API. Visit /docs for the API documentation"}

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
    books = session.exec(select(Book)).all()
    total_books = len(books)
    completed_books = sum(1 for book in books if book.status == "completed")
    in_progress_books = sum(1 for book in books if book.status == "in_progress")
    
    # Calculate total pages and average completion
    total_pages = sum(book.pages for book in books if book.pages)
    average_completion = (completed_books / total_books * 100) if total_books > 0 else 0

    # Genre statistics
    genre_stats = {}
    for book in books:
        if book.genre not in genre_stats:
            genre_stats[book.genre] = {"books": 0, "completed": 0}
        genre_stats[book.genre]["books"] += 1
        if book.status == "completed":
            genre_stats[book.genre]["completed"] += 1

    # Currently reading books
    current_books = [
        {
            "title": book.title,
            "progress": book.progress,
            "genre": book.genre
        }
        for book in books
        if book.status == "in_progress"
    ]

    return {
        "libraryStats": {
            "totalBooks": total_books,
            "completedBooks": completed_books,
            "inProgressBooks": in_progress_books,
            "totalPages": total_pages,
            "averageCompletion": round(average_completion, 1)
        },
        "genreData": [
            {
                "name": genre,
                "books": stats["books"],
                "completed": stats["completed"]
            }
            for genre, stats in genre_stats.items()
        ],
        "currentlyReading": current_books
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)