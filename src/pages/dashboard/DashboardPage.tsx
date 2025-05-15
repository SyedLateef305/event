import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, MapPin, TrendingUp } from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import MainLayout from '../../components/layout/MainLayout';
import Card, { CardContent } from '../../components/ui/Card';
import EventList from '../../components/events/EventList';
import { branches } from '../../data/mockData';

const DashboardPage: React.FC = () => {
  const { events, venues } = useEvents();
  const navigate = useNavigate();
  
  // Filter upcoming events
  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  
  // Calculate statistics
  const totalEvents = events.length;
  const totalRegistrations = events.reduce(
    (total, event) => total + event.registeredStudents.length, 
    0
  );
  const totalVenues = venues.length;
  
  // Calculate most popular event
  const mostPopularEvent = events.length > 0 
    ? events.reduce((prev, current) => 
        prev.registeredStudents.length > current.registeredStudents.length ? prev : current
      ) 
    : null;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-blue-50 border border-blue-100">
            <CardContent className="flex items-center p-6">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{totalEvents}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border border-green-100">
            <CardContent className="flex items-center p-6">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">Total Registrations</p>
                <p className="text-2xl font-bold text-gray-900">{totalRegistrations}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border border-purple-100">
            <CardContent className="flex items-center p-6">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600">Total Venues</p>
                <p className="text-2xl font-bold text-gray-900">{totalVenues}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-yellow-50 border border-yellow-100">
            <CardContent className="flex items-center p-6">
              <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-600">Upcoming Events</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingEvents.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Most Popular Event */}
        {mostPopularEvent && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Most Popular Event</h2>
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{mostPopularEvent.name}</h3>
                <p className="mb-4">{mostPopularEvent.description.substring(0, 120)}...</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{new Date(mostPopularEvent.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    <span>
                      {mostPopularEvent.registeredStudents.length} / {mostPopularEvent.capacity} registered
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/events/${mostPopularEvent.id}`)}
                  className="mt-4 px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 font-medium text-sm transition-colors"
                >
                  View Details
                </button>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Upcoming Events */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
            <button 
              onClick={() => navigate('/events')}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              View All
            </button>
          </div>
          <EventList events={upcomingEvents.slice(0, 3)} />
        </div>
        
        {/* Registration Analytics by Department */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Registration Analytics by Department</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {branches.map(branch => {
                  const branchEvents = events.filter(event => event.branchId === branch.id);
                  const registrations = branchEvents.reduce(
                    (total, event) => total + event.registeredStudents.length, 
                    0
                  );
                  const percentage = totalRegistrations > 0 
                    ? Math.round((registrations / totalRegistrations) * 100) 
                    : 0;
                  
                  return (
                    <div key={branch.id}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{branch.name}</span>
                        <span className="text-sm font-medium text-gray-700">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;