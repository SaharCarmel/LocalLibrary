import React, { useState, useEffect } from 'react';
import { useLibraryStats } from './hooks/useLibraryStats.js';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card.jsx';
import { Progress } from './components/ui/progress.jsx';
import { BookOpen } from 'lucide-react';
import { Button } from './components/ui/button';
import BookSelector from './BookSelector';
import SessionAdd from './components/SessionAdd';
import { Check } from 'lucide-react';

const LibraryAnalytics = () => {
  const [isBookSelectorOpen, setIsBookSelectorOpen] = useState(false);
  const [removeError, setRemoveError] = useState(null);
  const { stats, loading, error, allBooks, refetch, removeBook} = useLibraryStats();

  const handleRemoveBook = async (bookId) => {
    try {
      await removeBook(bookId);
      await refetch();
      setRemoveError(null);
    } catch (err) {
      setRemoveError('Failed to remove book');
    }
  };

  const markBookCompleted = async (bookId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/books/${bookId}/complete`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to mark book as completed');
      }
      // Refresh the stats after marking book as completed
      refetch();
    } catch (error) {
      console.error('Error marking book as completed:', error);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;
  if (!stats) return null;

  const { libraryStats, genreData, currentlyReading } = stats;
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Stats Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Total Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <p className="text-2xl font-bold">{libraryStats.totalBooks}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{libraryStats.completedBooks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{libraryStats.inProgressBooks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{libraryStats.averageCompletion}%</p>
              <Progress value={libraryStats.averageCompletion} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Charts */}
        <Card>
          <CardHeader>
            <CardTitle>Genre Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="books"
                  >
                    {genreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completion by Genre</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={genreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="books" fill="#4f46e5" name="Total Books" />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Currently Reading</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setIsBookSelectorOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Book
              </button>
            </div>
            {currentlyReading.map((book) => (
              <div key={book.title} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{book.title}</span>
                    <p className="text-sm text-gray-500">{book.genre}</p>
                  </div>
                  <div className="flex gap-2">
                    <SessionAdd 
                      bookId={book.id} 
                      onSessionAdded={refetch}
                    />
                    <Button
                      onClick={() => markBookCompleted(book.id)}
                      className="flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Mark Completed
                    </Button>
                    <div
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveBook(book.id)}
                    >
                      Remove
                    </div>
                  </div>
                </div>
                <Progress value={book.progress} />
              </div>
            ))}
            {removeError && (
              <div className="text-red-500 mt-2">{removeError}</div>
            )}
          </div>
        </CardContent>
      </Card>

      <BookSelector
        isOpen={isBookSelectorOpen}
        onClose={() => setIsBookSelectorOpen(false)}
        onSelect={async () => {
          await refetch();
          setIsBookSelectorOpen(false);
        }}
      />
    </div>
  );
};

export default LibraryAnalytics;
