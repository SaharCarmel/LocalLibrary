CREATE DATABASE library_analytics;
USE library_analytics;

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    year INT,
    genre VARCHAR(100),
    file_path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reading_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    start_page INT,
    end_page INT,
    reading_format ENUM('digital', 'physical'),
    comprehension_rating INT CHECK (comprehension_rating BETWEEN 1 AND 5),
    notes TEXT,
    location VARCHAR(100),
    energy_level INT CHECK (energy_level BETWEEN 1 AND 5),
    distractions BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id)
);