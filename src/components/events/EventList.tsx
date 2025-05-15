import React from 'react';
import { Event } from '../../types';
import EventCard from './EventCard';

interface EventListProps {
  events: Event[];
  showRegisterButton?: boolean;
}

const EventList: React.FC<EventListProps> = ({ events, showRegisterButton = true }) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No events found</h3>
        <p className="mt-2 text-sm text-gray-500">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} showRegisterButton={showRegisterButton} />
      ))}
    </div>
  );
};

export default EventList;