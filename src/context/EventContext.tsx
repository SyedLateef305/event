import React, { createContext, useContext, useState } from 'react';
import { Event, Feedback, Venue } from '../types';
import { events as mockEvents, venues as mockVenues } from '../data/mockData';

interface EventContextType {
  events: Event[];
  venues: Venue[];
  getEvent: (id: string) => Event | undefined;
  getVenue: (id: string) => Venue | undefined;
  addEvent: (event: Omit<Event, 'id' | 'feedback'>) => void;
  updateEvent: (event: Event) => void;
  registerForEvent: (eventId: string, studentId: string) => boolean;
  cancelRegistration: (eventId: string, studentId: string) => boolean;
  addFeedback: (eventId: string, feedback: Omit<Feedback, 'id'>) => void;
  filterEvents: (search: string, branch?: string, status?: string) => Event[];
}

const EventContext = createContext<EventContextType>({
  events: [],
  venues: [],
  getEvent: () => undefined,
  getVenue: () => undefined,
  addEvent: () => {},
  updateEvent: () => {},
  registerForEvent: () => false,
  cancelRegistration: () => false,
  addFeedback: () => {},
  filterEvents: () => [],
});

export const useEvents = () => useContext(EventContext);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [venues, setVenues] = useState<Venue[]>(mockVenues);

  const getEvent = (id: string) => {
    return events.find(event => event.id === id);
  };

  const getVenue = (id: string) => {
    return venues.find(venue => venue.id === id);
  };

  const addEvent = (event: Omit<Event, 'id' | 'feedback'>) => {
    const newEvent: Event = {
      ...event,
      id: `event${events.length + 1}`,
      feedback: [],
    };
    setEvents([...events, newEvent]);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const registerForEvent = (eventId: string, studentId: string): boolean => {
    const event = getEvent(eventId);
    if (!event) return false;
    
    if (event.registeredStudents.includes(studentId)) {
      return false; // Already registered
    }
    
    if (event.registeredStudents.length >= event.capacity) {
      return false; // Event is full
    }
    
    const updatedEvent = {
      ...event,
      registeredStudents: [...event.registeredStudents, studentId],
    };
    
    updateEvent(updatedEvent);
    return true;
  };

  const cancelRegistration = (eventId: string, studentId: string): boolean => {
    const event = getEvent(eventId);
    if (!event) return false;
    
    if (!event.registeredStudents.includes(studentId)) {
      return false; // Not registered
    }
    
    const updatedEvent = {
      ...event,
      registeredStudents: event.registeredStudents.filter(id => id !== studentId),
    };
    
    updateEvent(updatedEvent);
    return true;
  };

  const addFeedback = (eventId: string, feedback: Omit<Feedback, 'id'>) => {
    const event = getEvent(eventId);
    if (!event) return;
    
    const newFeedback: Feedback = {
      ...feedback,
      id: `feedback${event.feedback.length + 1}`,
    };
    
    const updatedEvent = {
      ...event,
      feedback: [...event.feedback, newFeedback],
    };
    
    updateEvent(updatedEvent);
  };

  const filterEvents = (search: string, branch?: string, status?: string): Event[] => {
    return events.filter(event => {
      const matchesSearch = search === '' || 
        event.name.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase());
      
      const matchesBranch = !branch || event.branchId === branch;
      const matchesStatus = !status || event.status === status;
      
      return matchesSearch && matchesBranch && matchesStatus;
    });
  };

  return (
    <EventContext.Provider value={{
      events,
      venues,
      getEvent,
      getVenue,
      addEvent,
      updateEvent,
      registerForEvent,
      cancelRegistration,
      addFeedback,
      filterEvents,
    }}>
      {children}
    </EventContext.Provider>
  );
};