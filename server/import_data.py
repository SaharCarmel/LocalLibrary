import csv
from datetime import datetime
from sqlmodel import Session
from database import engine, init_db
from models import Book, ReadingSession

def import_books():
    init_db()
    with Session(engine) as session:
        with open('/Users/saharcarmel/Library/Mobile Documents/com~apple~CloudDocs/Books/library-analytics/library_database.csv', 'r') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                # Convert completed_date if it exists
                completed_date = None
                if row.get('completed_date'):
                    try:
                        completed_date = datetime.strptime(row['completed_date'], '%Y-%m-%d')
                    except ValueError:
                        pass

                book = Book(
                    title=row['title'],
                    author=row['author'],
                    year=int(row['year']) if row.get('year') else None,
                    genre=row.get('genre'),
                    file_path=row.get('file_path'),
                    pages=int(row['pages']) if row.get('pages') else None,
                    progress=int(row['progress']) if row.get('progress') else None,
                    completed_date=completed_date,
                    rating=int(row['rating']) if row.get('rating') else None,
                    language=row.get('language'),
                    format=row.get('format'),
                    source=row.get('source'),
                    notes=row.get('notes'),
                    status=row.get('status', 'not_started')
                )
                session.add(book)
            session.commit()

if __name__ == "__main__":
    import_books()