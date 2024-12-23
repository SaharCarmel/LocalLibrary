import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ReadingMetrics from './ReadingMetrics';
import LibraryAnalytics from './LibraryAnalytics';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link to="/" className="inline-flex items-center px-1 pt-1 text-gray-900">
                  Library Analytics
                </Link>
                <Link to="/reading-metrics" className="inline-flex items-center px-1 pt-1 text-gray-900">
                  Reading Metrics
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="py-6">
          <Routes>
            <Route path="/" element={<LibraryAnalytics />} />
            <Route path="/reading-metrics" element={<ReadingMetrics />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
