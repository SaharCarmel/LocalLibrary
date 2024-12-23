
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Button = ({ children, to, className = '' }) => {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate(to)}
      className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors ${className}`}
    >
      {children}
    </button>
  );
};