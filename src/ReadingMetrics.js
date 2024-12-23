import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Clock, TrendingUp } from 'lucide-react';

const ReadingMetrics = () => {
  const [speedMetrics] = useState({
    averageSpeed: 35,
    fastestSpeed: 48,
    slowestSpeed: 22,
    bestTimeOfDay: 'morning',
    bestDayOfWeek: 'Saturday',
    totalReadingTime: 120
  });

  const timeOfDayData = [
    { name: 'Morning', pagesPerHour: 42 },
    { name: 'Afternoon', pagesPerHour: 35 },
    { name: 'Evening', pagesPerHour: 38 },
    { name: 'Night', pagesPerHour: 30 }
  ];

  const weeklyData = [
    { name: 'Mon', pagesPerHour: 32, totalPages: 120 },
    { name: 'Tue', pagesPerHour: 35, totalPages: 140 },
    { name: 'Wed', pagesPerHour: 38, totalPages: 90 },
    { name: 'Thu', pagesPerHour: 40, totalPages: 160 },
    { name: 'Fri', pagesPerHour: 36, totalPages: 130 },
    { name: 'Sat', pagesPerHour: 45, totalPages: 200 },
    { name: 'Sun', pagesPerHour: 42, totalPages: 180 }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-6">
      <h1 className="text-3xl font-bold">Reading Speed Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-2">
            <TrendingUp className="w-6 h-6" />
            <CardTitle>Average Speed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{speedMetrics.averageSpeed}</p>
            <p className="text-sm text-gray-500">pages per hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-x-2">
            <Clock className="w-6 h-6" />
            <CardTitle>Best Reading Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold capitalize">{speedMetrics.bestTimeOfDay}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Reading Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{speedMetrics.totalReadingTime}h</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reading Speed by Time of Day</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeOfDayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pagesPerHour" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Reading Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="pagesPerHour" stroke="#4f46e5" name="Pages per Hour" />
                <Line yAxisId="right" type="monotone" dataKey="totalPages" stroke="#10b981" name="Total Pages" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReadingMetrics;