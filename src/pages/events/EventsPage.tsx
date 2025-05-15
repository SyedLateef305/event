import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import MainLayout from '../../components/layout/MainLayout';
import EventList from '../../components/events/EventList';
import EventFilter from '../../components/events/EventFilter';
import Button from '../../components/ui/Button';

const EventsPage: React.FC = () => {
  const { events, filterEvents } = useEvents();
  const { isAuthenticated, currentUser } = useAuth();
  const [filteredEvents, setFilteredEvents] = useState(events);

  const handleFilter = (search: string, branch: string, status: string) => {
    const filtered = filterEvents(search, branch, status);
    setFilteredEvents(filtered);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Events</h1>
            <p className="text-gray-600">Browse and register for upcoming campus events</p>
          </div>
          
          {isAuthenticated && (currentUser?.role === 'admin' || currentUser?.role === 'host') && (
            <Link to="/events/create" className="mt-4 md:mt-0">
              <Button className="flex items-center">
                <Plus size={18} className="mr-1" />
                Create Event
              </Button>
            </Link>
          )}
        </div>
        
        <EventFilter onFilter={handleFilter} />
        
        <EventList events={filteredEvents} />
      </div>
    </MainLayout>
  );
};

export default EventsPage;