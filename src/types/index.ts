export interface User {
  id: string;
  email: string;
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
  role: 'admin' | 'student' | 'host';
}

export interface Admin extends User {
  role: 'admin';
  department: string;
}

export interface Student extends User {
  role: 'student';
  usn: string;
  year: number;
  branch: string;
}

export interface Host extends User {
  role: 'host';
  events: string[];
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  branchId: string;
  organizer: string;
  capacity: number;
  registeredStudents: string[];
  feedback: Feedback[];
  venueId: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  imageUrl?: string;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
  resources: string[];
  events: string[];
}

export interface Feedback {
  id: string;
  eventId: string;
  studentId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Branch {
  id: string;
  name: string;
}