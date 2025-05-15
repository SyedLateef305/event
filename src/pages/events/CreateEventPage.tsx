import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card, { CardContent, CardHeader } from '../../components/ui/Card';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import { branches } from '../../data/mockData';

const CreateEventPage: React.FC = () => {
  const { addEvent, venues } = useEvents();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    branchId: '',
    capacity: 50,
    venueId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      // Create new event
      addEvent({
        ...formData,
        organizer: currentUser.id,
        registeredStudents: [],
        status: 'upcoming',
      });
      
      // Navigate to events page
      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/events')}
          className="mb-6"
        >
          ← Back to Events
        </Button>
        
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
            <p className="text-gray-600">Fill out the form below to create a new event</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Event Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter event name"
              />
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your event"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Event Date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
                
                <Input
                  label="Event Time"
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <Select
                label="Department/Branch"
                name="branchId"
                value={formData.branchId}
                onChange={handleChange}
                options={branches.map(branch => ({
                  value: branch.id,
                  label: branch.name,
                }))}
                required
                placeholder="Select a department"
              />
              
              <Select
                label="Venue"
                name="venueId"
                value={formData.venueId}
                onChange={(e) => {
                  const selectedVenue = venues.find(venue => venue.id === e.target.value);
                  setFormData({
                    ...formData,
                    venueId: e.target.value,
                    location: selectedVenue ? selectedVenue.name : '',
                    capacity: selectedVenue ? selectedVenue.capacity : 50,
                  });
                }}
                options={venues.map(venue => ({
                  value: venue.id,
                  label: `${venue.name} (Capacity: ${venue.capacity})`,
                }))}
                required
                placeholder="Select a venue"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Event location"
                />
                
                <Input
                  label="Capacity"
                  type="number"
                  name="capacity"
                  value={formData.capacity.toString()}
                  onChange={handleChange}
                  required
                  min={1}
                />
              </div>
              
              <Input
                label="Event Image URL (Optional)"
                name="imageUrl"
                value={formData.imageUrl || ''}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
              
              <div className="flex justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/events')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Event'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CreateEventPage;