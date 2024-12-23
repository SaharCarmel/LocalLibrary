import express from 'express';
import cors from 'cors';
import { parse } from 'csv-parse';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Read and parse CSV data
const csvPath = path.join(__dirname, '..', 'library_database.csv');
const books = [];

fs.createReadStream(csvPath)
  .pipe(parse({ columns: true }))
  .on('data', (data) => books.push(data))
  .on('end', () => console.log('CSV data loaded'));

// Routes
app.get('/api/books', (req, res) => {
  res.json(books);
});

app.get('/api/books/stats', (req, res) => {
  const totalBooks = books.length;
  const genres = [...new Set(books.map(book => book.genre))];
  const booksPerGenre = genres.reduce((acc, genre) => {
    acc[genre] = books.filter(book => book.genre === genre).length;
    return acc;
  }, {});

  res.json({
    totalBooks,
    genres,
    booksPerGenre
  });
});

app.get('/api/books/search', (req, res) => {
  const query = req.query.q?.toLowerCase();
  if (!query) return res.json([]);

  const results = books.filter(book => 
    book.title?.toLowerCase().includes(query) || 
    book.author?.toLowerCase().includes(query)
  );
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});