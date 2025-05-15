import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Event } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface EventCardProps {
  event: Event;
  showRegisterButton?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, showRegisterButton = true }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="info">Upcoming</Badge>;
      case 'ongoing':
        return <Badge variant="warning">Ongoing</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg">
      <div 
        className="h-48 bg-cover bg-center" 
        style={{ 
          backgroundImage: `url(${event.imageUrl || 'https://images.pexels.com/photos/3321797/pexels-photo-3321797.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'})`,
        }}
      />
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{event.name}</h3>
          {getStatusBadge(event.status)}
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2 text-blue-500" />
            <span>{formatDate(event.date)} at {event.time}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-2 text-blue-500" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users size={16} className="mr-2 text-blue-500" />
            <span>{event.registeredStudents.length} / {event.capacity} registered</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-auto">
          <Link
            to={`/events/${event.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </Link>
          
          {showRegisterButton && event.status === 'upcoming' && (
            <Link
              to={`/events/${event.id}`}
              className={`text-sm px-3 py-1 rounded-full ${
                event.registeredStudents.length >= event.capacity
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {event.registeredStudents.length >= event.capacity
                ? 'Full'
                : 'Register'}
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EventCard;