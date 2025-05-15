import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/ui/Button';
import Card, { CardContent } from '../../components/ui/Card';
import EventList from '../../components/events/EventList';

const MyRegistrationsPage: React.FC = () => {
  const { events } = useEvents();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  if (!currentUser) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Not Signed In</h1>
          <p className="text-gray-600 mb-8">Please sign in to view your registrations.</p>
          <Button onClick={() => navigate('/login')}>Sign In</Button>
        </div>
      </MainLayout>
    );
  }
  
  // Get events user is registered for
  const registeredEvents = events.filter(event => 
    event.registeredStudents.includes(currentUser.id)
  );
  
  // Split by status
  const upcomingEvents = registeredEvents.filter(event => event.status === 'upcoming');
  const pastEvents = registeredEvents.filter(event => event.status === 'completed');

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Registrations</h1>
        
        {registeredEvents.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-900 mb-2">No Registrations Yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't registered for any events yet. Browse upcoming events to find something interesting!
              </p>
              <Button onClick={() => navigate('/events')}>Browse Events</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
              {upcomingEvents.length > 0 ? (
                <EventList events={upcomingEvents} showRegisterButton={false} />
              ) : (
                <p className="text-gray-600 py-4">No upcoming events. Browse more events to register!</p>
              )}
            </div>
            
            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Events</h2>
                <EventList events={pastEvents} showRegisterButton={false} />
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default MyRegistrationsPage;