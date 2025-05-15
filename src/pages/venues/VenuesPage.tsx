import React from 'react';
import { useEvents } from '../../context/EventContext';
import MainLayout from '../../components/layout/MainLayout';
import VenueCard from '../../components/venues/VenueCard';

const VenuesPage: React.FC = () => {
  const { venues } = useEvents();

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Venues</h1>
          <p className="text-gray-600">Browse available venues for your events</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default VenuesPage;