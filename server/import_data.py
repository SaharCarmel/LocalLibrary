import csv
from sqlmodel import Session
from database import engine, init_db
from models import Book, ReadingSession

def import_books():
    init_db()
    with Session(engine) as session:
        with open('/Users/saharcarmel/Library/Mobile Documents/com~apple~CloudDocs/Books/library-analytics/library_database.csv', 'r') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                book = Book(
                    title=row['title'],
                    author=row['author'],
                    year=int(row['year']),
                    genre=row['genre'],
                    file_path=row['file_path']
                )
                session.add(book)
            session.commit()

if __name__ == "__main__":
    import_books()