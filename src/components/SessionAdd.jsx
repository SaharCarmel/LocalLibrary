import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const SessionAdd = ({ bookId, onSessionAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    book_id: bookId,
    start_time: new Date().toISOString().slice(0, 16), // YYYY-MM-DDThh:mm format
    end_time: new Date().toISOString().slice(0, 16),
    start_page: '',
    end_page: '',
    location: '',
    reading_format: 'physical', // default value
    comprehension_rating: '',
    energy_level: '',
    distractions: false,
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert string values to appropriate types
      const processedData = {
        ...formData,
        start_page: formData.start_page ? parseInt(formData.start_page) : null,
        end_page: formData.end_page ? parseInt(formData.end_page) : null,
        comprehension_rating: formData.comprehension_rating ? parseInt(formData.comprehension_rating) : null,
        energy_level: formData.energy_level ? parseInt(formData.energy_level) : null,
        distractions: Boolean(formData.distractions)
      };

      const response = await fetch('http://localhost:3001/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      });

      if (!response.ok) throw new Error('Failed to add session');
      
      setIsOpen(false);
      if (onSessionAdded) onSessionAdded();
    } catch (error) {
      console.error('Error adding session:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Add Session
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Reading Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="start_time">Start Time</Label>
            <Input
              id="start_time"
              name="start_time"
              type="datetime-local"
              required
              value={formData.start_time}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="end_time">End Time</Label>
            <Input
              id="end_time"
              name="end_time"
              type="datetime-local"
              required
              value={formData.end_time}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="start_page">Start Page</Label>
            <Input
              id="start_page"
              name="start_page"
              type="number"
              value={formData.start_page}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="end_page">End Page</Label>
            <Input
              id="end_page"
              name="end_page"
              type="number"
              value={formData.end_page}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reading_format">Format</Label>
            <select
              id="reading_format"
              name="reading_format"
              className="flex h-10 w-full rounded-md border border-input px-3 py-2"
              value={formData.reading_format}
              onChange={handleChange}
            >
              <option value="physical">Physical</option>
              <option value="digital">Digital</option>
              <option value="audio">Audio</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="comprehension_rating">Comprehension (1-5)</Label>
            <Input
              id="comprehension_rating"
              name="comprehension_rating"
              type="number"
              min="1"
              max="5"
              value={formData.comprehension_rating}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="energy_level">Energy Level (1-5)</Label>
            <Input
              id="energy_level"
              name="energy_level"
              type="number"
              min="1"
              max="5"
              value={formData.energy_level}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="distractions"
              name="distractions"
              type="checkbox"
              checked={formData.distractions}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                distractions: e.target.checked
              }))}
            />
            <Label htmlFor="distractions">Distractions</Label>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              name="notes"
              className="flex min-h-[80px] w-full rounded-md border border-input px-3 py-2"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" className="w-full">
            Add Session
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SessionAdd;
