import React, { useState, useEffect } from 'react';

const BookSelector = ({ isOpen, onClose, onSelect }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:3001/api/books')
        .then(response => response.json())
        .then(data => {
          const availableBooks = data.filter(book => book.status === 'not_started' || book.status === null);
          setBooks(availableBooks);
        });
    }
  }, [isOpen]);

  const handleBookSelect = async (book) => {
    try {
      const response = await fetch(`http://localhost:3001/api/books/${book.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'in_progress' }),
      });
      
      if (response.ok) {
        onSelect(book);
        onClose();
      }
    } catch (error) {
      console.error('Error updating book status:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Select a Book to Read</h2>
        <div className="max-h-96 overflow-y-auto">
          {books.map(book => (
            <div 
              key={book.id}
              className="p-3 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => handleBookSelect(book)}
            >
              <p className="font-semibold">{book.title}</p>
              <p className="text-sm text-gray-600">{book.author}</p>
            </div>
          ))}
        </div>
        <button
          className="mt-4 px-4 py-2 bg-gray-200 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BookSelector;
