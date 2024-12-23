import os
import csv
import re
from PyPDF2 import PdfReader


def clean_title(title):
    if not title:
        return ''
    clean = re.sub(r'\.(pdf|epub|mobi)$', '', title, flags=re.I)
    clean = re.sub(r'\[.*?\]|\(.*?\)', '', clean)
    clean = re.sub(r'\s*[-–]\s*.*$', '', clean)
    clean = re.sub(r'\s+by\s+.*$', '', clean, flags=re.I)
    clean = clean.replace('_', ' ')
    return ' '.join(clean.split()).strip()


def get_pdf_metadata(file_path):
    try:
        with open(file_path, 'rb') as file:
            pdf = PdfReader(file)
            info = pdf.metadata
            raw_title = info.get('/Title', '') or os.path.basename(file_path)
            return {
                'filename': os.path.basename(file_path),
                'path': file_path,
                'pages': len(pdf.pages),
                'title': raw_title,
                'clean_title': clean_title(raw_title),
                'author': info.get('/Author', ''),
                'subject': info.get('/Subject', ''),
                'creation_date': info.get('/CreationDate', ''),
                'size_mb': round(os.path.getsize(file_path) / (1024 * 1024), 2)
            }
    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}")
        return None


def scan_library(root_dir):
    pdf_files = []
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.lower().endswith('.pdf'):
                full_path = os.path.join(root, file)
                metadata = get_pdf_metadata(full_path)
                if metadata:
                    pdf_files.append(metadata)
    return pdf_files


def save_to_csv(pdf_files, output_file):
    if not pdf_files:
        print("No PDF files found")
        return

    fields = ['filename', 'path', 'pages', 'title', 'clean_title',
              'author', 'subject', 'creation_date', 'size_mb']

    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fields)
        writer.writeheader()
        writer.writerows(pdf_files)


def main():
    library_path = '/users/saharcarmel/library/mobile documents/com~apple~clouddocs/books'
    output_file = 'library_database.csv'

    print("Scanning library...")
    pdf_files = scan_library(library_path)
    print(f"Found {len(pdf_files)} PDF files")

    save_to_csv(pdf_files, output_file)
    print(f"Database saved to {output_file}")


if __name__ == '__main__':
    main()
