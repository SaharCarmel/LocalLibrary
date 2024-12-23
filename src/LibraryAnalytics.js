import React, { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Progress } from './components/ui/progress';
import { BookOpen } from 'lucide-react';

const LibraryAnalytics = () => {
  const [libraryStats] = useState({
    totalBooks: 155,
    completedBooks: 89,
    inProgressBooks: 4,
    totalPages: 46500,
    averageCompletion: 75
  });

  const genreData = [
    { name: 'Fiction', books: 45, completed: 30 },
    { name: 'Non-Fiction', books: 30, completed: 20 },
    { name: 'Science', books: 25, completed: 15 },
    { name: 'History', books: 20, completed: 12 },
    { name: 'Technology', books: 35, completed: 22 }
  ];

  const currentlyReading = [
    { title: 'The Great Gatsby', progress: 65, genre: 'Fiction' },
    { title: 'Deep Learning', progress: 85, genre: 'Technology' },
    { title: 'Clean Code', progress: 45, genre: 'Technology' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-6">
      <h1 className="text-3xl font-bold">Library Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Books</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{libraryStats.totalBooks}</p>
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
            <p className="text-2xl font-bold">{libraryStats.averageCompletion}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            {currentlyReading.map((book) => (
              <div key={book.title} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{book.title}</span>
                    <p className="text-sm text-gray-500">{book.genre}</p>
                  </div>
                  <span className="text-sm text-gray-500">{book.progress}%</span>
                </div>
                <Progress value={book.progress} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LibraryAnalytics;