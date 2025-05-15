import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Star } from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/ui/Button';
import Card, { CardContent, CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEvent, getVenue, registerForEvent, cancelRegistration, addFeedback } = useEvents();
  const { isAuthenticated, currentUser } = useAuth();
  
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [showFeedbackForm, setShowFeedbackForm] = useState<boolean>(false);
  
  const event = id ? getEvent(id) : undefined;
  const venue = event?.venueId ? getVenue(event.venueId) : undefined;
  
  if (!event) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h1>
          <p className="text-gray-600 mb-8">The event you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/events')}>Browse Events</Button>
        </div>
      </MainLayout>
    );
  }
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const isRegistered = currentUser 
    ? event.registeredStudents.includes(currentUser.id)
    : false;
  
  const canRegister = event.status === 'upcoming' && 
    event.registeredStudents.length < event.capacity &&
    currentUser?.role === 'student';
  
  const handleRegister = () => {
    if (!isAuthenticated || !currentUser) {
      navigate('/login');
      return;
    }
    
    if (canRegister) {
      registerForEvent(event.id, currentUser.id);
    }
  };
  
  const handleCancelRegistration = () => {
    if (!isAuthenticated || !currentUser) return;
    
    cancelRegistration(event.id, currentUser.id);
  };
  
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !currentUser || rating === 0) return;
    
    addFeedback(event.id, {
      eventId: event.id,
      studentId: currentUser.id,
      rating,
      comment,
      date: new Date().toISOString(),
    });
    
    setRating(0);
    setComment('');
    setShowFeedbackForm(false);
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
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/events')}
            className="mb-4"
          >
            ← Back to Events
          </Button>
          
          <div className="flex flex-wrap items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
                {getStatusBadge(event.status)}
              </div>
              <p className="text-gray-600 text-lg">{event.description}</p>
            </div>
            
            <div className="mt-4 sm:mt-0">
              {isAuthenticated && currentUser?.role === 'student' && (
                <>
                  {isRegistered ? (
                    <Button 
                      variant="outline" 
                      onClick={handleCancelRegistration}
                      className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    >
                      Cancel Registration
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleRegister}
                      disabled={!canRegister}
                    >
                      {event.registeredStudents.length >= event.capacity
                        ? 'Event Full'
                        : 'Register Now'}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Event Image */}
            <div className="rounded-lg overflow-hidden mb-8 shadow-md">
              <img 
                src={event.imageUrl || "https://images.pexels.com/photos/3321797/pexels-photo-3321797.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} 
                alt={event.name} 
                className="w-full h-[300px] object-cover"
              />
            </div>
            
            {/* Event Details */}
            <Card className="mb-8">
              <CardHeader>
                <h2 className="text-xl font-semibold">Event Details</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Date</h3>
                      <p className="text-gray-600">{formatDate(event.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Time</h3>
                      <p className="text-gray-600">{event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Location</h3>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Capacity</h3>
                      <p className="text-gray-600">
                        {event.registeredStudents.length} / {event.capacity} registered
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${(event.registeredStudents.length / event.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Feedback Section */}
            <Card>
              <CardHeader className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Feedback</h2>
                {isAuthenticated && 
                  currentUser?.role === 'student' && 
                  isRegistered && 
                  event.status === 'completed' && (
                  <Button 
                    size="sm" 
                    onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                  >
                    {showFeedbackForm ? 'Cancel' : 'Add Feedback'}
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {showFeedbackForm && (
                  <form onSubmit={handleSubmitFeedback} className="mb-8 p-4 bg-gray-50 rounded-lg">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                          >
                            <Star 
                              className={`h-6 w-6 ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                        Comment
                      </label>
                      <textarea
                        id="comment"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Share your experience..."
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={rating === 0}
                    >
                      Submit Feedback
                    </Button>
                  </form>
                )}
                
                {event.feedback.length > 0 ? (
                  <div className="space-y-4">
                    {event.feedback.map((feedback) => (
                      <div key={feedback.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              className={`h-4 w-4 ${feedback.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-gray-600 text-sm">{feedback.comment}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(feedback.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No feedback yet</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            {/* Venue Information */}
            <Card className="mb-8">
              <CardHeader>
                <h2 className="text-xl font-semibold">Venue Information</h2>
              </CardHeader>
              <CardContent>
                {venue ? (
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">{venue.name}</h3>
                    <p className="text-gray-600 flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      {venue.location}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-1" />
                      Capacity: {venue.capacity}
                    </p>
                    
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Available Resources:</h4>
                      <ul className="list-disc list-inside text-gray-600 text-sm">
                        {venue.resources.map((resource, index) => (
                          <li key={index}>{resource}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Venue information not available</p>
                )}
              </CardContent>
            </Card>
            
            {/* Registration Information */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Registration Information</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Status</h3>
                    <div className="mt-1">
                      {event.registeredStudents.length >= event.capacity ? (
                        <Badge variant="error">Full</Badge>
                      ) : (
                        <Badge variant="success">Open</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">Registered</h3>
                    <p className="text-gray-600">
                      {event.registeredStudents.length} out of {event.capacity} spots filled
                    </p>
                  </div>
                  
                  {isAuthenticated && currentUser?.role === 'student' && (
                    <div>
                      <h3 className="font-medium text-gray-900">Your Status</h3>
                      <p className="text-gray-600">
                        {isRegistered ? (
                          <span className="text-green-600 font-medium">Registered</span>
                        ) : (
                          <span className="text-gray-600">Not Registered</span>
                        )}
                      </p>
                    </div>
                  )}
                  
                  {!isAuthenticated && (
                    <div className="mt-4">
                      <p className="text-gray-600 mb-2">Sign in to register for this event</p>
                      <Button 
                        onClick={() => navigate('/login')} 
                        fullWidth
                      >
                        Sign in
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EventDetailPage;