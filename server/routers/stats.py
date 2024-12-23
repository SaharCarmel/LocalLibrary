from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from models import Book
from database import get_session

router = APIRouter(prefix="/api/stats", tags=["stats"])

@router.get("")
def get_stats(session: Session = Depends(get_session)):
    books = session.execute(select(Book)).scalars().all()
    total_books = len(books)
    completed_books = sum(1 for book in books if book.status == "completed")
    in_progress_books = sum(1 for book in books if book.status == "in_progress")
    
    total_pages = sum(book.pages for book in books if book.pages)
    average_completion = (completed_books / total_books * 100) if total_books > 0 else 0

    genre_stats = {}
    for book in books:
        if book.genre not in genre_stats:
            genre_stats[book.genre] = {"books": 0, "completed": 0}
        genre_stats[book.genre]["books"] += 1
        if book.status == "completed":
            genre_stats[book.genre]["completed"] += 1

    current_books = [
        {
            "title": book.title,
            "progress": book.progress,
            "genre": book.genre,
            "id": book.id
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
