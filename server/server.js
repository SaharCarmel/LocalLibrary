import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Books endpoints
app.get('/api/books', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM books');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/books/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Book not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/books/search', async (req, res) => {
  try {
    const { query } = req.query;
    const [rows] = await pool.query(
      'SELECT * FROM books WHERE title LIKE ? OR author LIKE ?', 
      [`%${query}%`, `%${query}%`]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reading sessions endpoints
app.post('/api/sessions', async (req, res) => {
  try {
    const { book_id, start_time, end_time, start_page, end_page, reading_format, 
            comprehension_rating, notes, location, energy_level, distractions } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO reading_sessions (book_id, start_time, end_time, start_page, end_page, reading_format, comprehension_rating, notes, location, energy_level, distractions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [book_id, start_time, end_time, start_page, end_page, reading_format, comprehension_rating, notes, location, energy_level, distractions]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/sessions', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT rs.*, b.title as book_title 
      FROM reading_sessions rs 
      JOIN books b ON rs.book_id = b.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const [totalReadingTime] = await pool.query(`
      SELECT SUM(TIMESTAMPDIFF(MINUTE, start_time, end_time)) as total_minutes 
      FROM reading_sessions
    `);
    
    const [pagesPerBook] = await pool.query(`
      SELECT b.title, SUM(rs.end_page - rs.start_page) as pages_read
      FROM reading_sessions rs
      JOIN books b ON rs.book_id = b.id
      GROUP BY b.id
    `);

    const [readingByLocation] = await pool.query(`
      SELECT location, COUNT(*) as session_count
      FROM reading_sessions
      GROUP BY location
    `);

    res.json({
      totalReadingTime: totalReadingTime[0].total_minutes,
      pagesPerBook,
      readingByLocation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});