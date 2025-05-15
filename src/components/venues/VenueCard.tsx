import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Package } from 'lucide-react';
import { Venue } from '../../types';
import Card from '../ui/Card';

interface VenueCardProps {
  venue: Venue;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg">
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{venue.name}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-2 text-blue-500" />
            <span>{venue.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users size={16} className="mr-2 text-blue-500" />
            <span>Capacity: {venue.capacity}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Package size={16} className="mr-2 text-blue-500" />
            <span>Resources: {venue.resources.join(', ')}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-auto">
          <span className="text-sm text-gray-500">
            {venue.events.length} events scheduled
          </span>
          <Link
            to={`/venues/${venue.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default VenueCard;