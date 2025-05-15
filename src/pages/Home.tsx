import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin, Award } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import MainLayout from '../components/layout/MainLayout';
import EventList from '../components/events/EventList';
import Button from '../components/ui/Button';

const Home: React.FC = () => {
  const { events } = useEvents();
  
  // Get upcoming events
  const upcomingEvents = events
    .filter(event => event.status === 'upcoming')
    .slice(0, 3);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Simplify Your College Event Management
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                From registration to feedback, our platform streamlines every aspect of campus events.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/events">
                  <Button className="bg-white text-blue-700 hover:bg-blue-50">
                    Browse Events
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-blue-700">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="College Events" 
                className="rounded-lg shadow-2xl max-h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Everything You Need to Manage Campus Events</h2>
            <p className="mt-4 text-xl text-gray-600">
              Powerful features designed specifically for college event management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Event Creation</h3>
              <p className="text-gray-600">
                Create and manage events with detailed information, scheduling, and venue allocation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Registration</h3>
              <p className="text-gray-600">
                Simple registration process for students with attendance tracking and reminders.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Venue Management</h3>
              <p className="text-gray-600">
                Track venue availability, capacity, and resource allocation for optimal planning.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Feedback Collection</h3>
              <p className="text-gray-600">
                Gather event feedback to improve future planning and measure success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
            <Link 
              to="/events" 
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              View all events
              <svg className="ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <EventList events={upcomingEvents} />

          {upcomingEvents.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-gray-900">No upcoming events</h3>
              <p className="mt-2 text-gray-500">Check back soon for new events!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to streamline your event management?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join our platform today and experience the easiest way to manage college events.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button className="bg-white text-blue-700 hover:bg-blue-50">
                Get Started
              </Button>
            </Link>
            <Link to="/events">
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-blue-700">
                Explore Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;