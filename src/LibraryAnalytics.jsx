import React from 'react';
import { useLibraryStats } from './hooks/useLibraryStats.js';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card.jsx';
import { Progress } from './components/ui/progress.jsx';
import { BookOpen } from 'lucide-react';
import { Button } from './components/ui/button';

const LibraryAnalytics = () => {
  const { stats, loading, error } = useLibraryStats();

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;
  if (!stats) return null;

  const { libraryStats, genreData, currentlyReading } = stats;
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Library Overview</h1>
        <Button to="/reading-metrics">View Reading Metrics</Button>
      </div>

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
