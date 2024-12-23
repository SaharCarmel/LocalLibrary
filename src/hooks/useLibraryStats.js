import { useState, useEffect, useCallback } from 'react';

export const useLibraryStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allBooks, setAllBooks] = useState([]);

  const fetchAllBooks = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/books');
      if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.status}`);
      }
      const data = await response.json();
      setAllBooks(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/stats');
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }
      const data = await response.json();
      setStats(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeBook = async (bookId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/books/${bookId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'not_started' })
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove book from reading list');
      }
      
      await fetchStats();
    } catch (error) {
      console.error('Error removing book:', error);
    }
  };

  const refetchStatsAndBooks = async () => {
    await fetchStats();
    await fetchAllBooks();
  } 

  useEffect(() => {
    fetchStats();
    fetchAllBooks();
  }, [fetchStats, fetchAllBooks]);

  return {
    stats,
    loading,
    error,
    allBooks,
    refetch: refetchStatsAndBooks,  // This is now properly defined as an async function
    removeBook, // Add this to the returned object
  };
};
