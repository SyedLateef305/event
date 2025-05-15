import { Admin, Branch, Event, Student, User, Venue } from '../types';

export const branches: Branch[] = [
  { id: 'cse', name: 'Computer Science Engineering' },
  { id: 'ece', name: 'Electronics and Communication Engineering' },
  { id: 'mech', name: 'Mechanical Engineering' },
  { id: 'civil', name: 'Civil Engineering' },
];

export const users: User[] = [
  {
    id: 'admin1',
    email: 'admin@college.edu',
    password: 'admin123',
    name: { firstName: 'Admin', lastName: 'User' },
    role: 'admin',
  },
  {
    id: 'student1',
    email: 'john@college.edu',
    password: 'student123',
    name: { firstName: 'John', lastName: 'Doe' },
    role: 'student',
  },
  {
    id: 'host1',
    email: 'host@college.edu',
    password: 'host123',
    name: { firstName: 'Host', lastName: 'User' },
    role: 'host',
  },
];

export const admins: Admin[] = [
  {
    id: 'admin1',
    email: 'admin@college.edu',
    password: 'admin123',
    name: { firstName: 'Admin', lastName: 'User' },
    role: 'admin',
    department: 'Student Affairs',
  },
];

export const students: Student[] = [
  {
    id: 'student1',
    email: 'john@college.edu',
    password: 'student123',
    name: { firstName: 'John', lastName: 'Doe' },
    role: 'student',
    usn: 'IRN23CS139',
    year: 3,
    branch: 'cse',
  },
  {
    id: 'student2',
    email: 'jane@college.edu',
    password: 'student123',
    name: { firstName: 'Jane', lastName: 'Smith' },
    role: 'student',
    usn: 'IRN23CS140',
    year: 2,
    branch: 'ece',
  },
  {
    id: 'student3',
    email: 'varshitha@college.edu',
    password: 'student123',
    name: { firstName: 'Varshitha', lastName: 'A' },
    role: 'student',
    usn: 'IRN23CS239',
    year: 3,
    branch: 'cse',
  },
  {
    id: 'student4',
    email: 'sinchana@college.edu',
    password: 'student123',
    name: { firstName: 'Sinchana', lastName: 'K' },
    role: 'student',
    usn: 'IRN23CS205',
    year: 3,
    branch: 'cse',
  },
];

export const venues: Venue[] = [
  {
    id: 'venue1',
    name: 'Main Auditorium',
    location: 'Main Campus',
    capacity: 500,
    resources: ['Projector', 'Sound System', 'Chairs'],
    events: ['event1', 'event3'],
  },
  {
    id: 'venue2',
    name: 'Seminar Hall',
    location: 'Engineering Block',
    capacity: 150,
    resources: ['Projector', 'Whiteboards', 'Tables'],
    events: ['event2'],
  },
  {
    id: 'venue3',
    name: 'Open Air Theatre',
    location: 'East Campus',
    capacity: 1000,
    resources: ['Stage', 'Sound System', 'Lighting'],
    events: [],
  },
];

export const events: Event[] = [
  {
    id: 'event1',
    name: 'Annual Tech Symposium',
    description: 'A gathering of tech enthusiasts showcasing latest innovations and research.',
    date: '2025-03-15',
    time: '09:00 AM',
    location: 'Main Auditorium',
    branchId: 'cse',
    organizer: 'host1',
    capacity: 500,
    registeredStudents: ['student1', 'student3'],
    feedback: [
      {
        id: 'feedback1',
        eventId: 'event1',
        studentId: 'student1',
        rating: 4,
        comment: 'Great event, learned a lot!',
        date: '2025-03-15',
      },
    ],
    venueId: 'venue1',
    status: 'upcoming',
    imageUrl: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'event2',
    name: 'Career Development Workshop',
    description: 'Enhance your career prospects with guidance from industry experts.',
    date: '2025-03-20',
    time: '02:00 PM',
    location: 'Seminar Hall',
    branchId: 'ece',
    organizer: 'host1',
    capacity: 150,
    registeredStudents: ['student2', 'student4'],
    feedback: [],
    venueId: 'venue2',
    status: 'upcoming',
    imageUrl: 'https://images.pexels.com/photos/7063778/pexels-photo-7063778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'event3',
    name: 'Cultural Festival',
    description: 'Celebrate diversity with performances, food, and art from different cultures.',
    date: '2025-04-05',
    time: '10:00 AM',
    location: 'Main Auditorium',
    branchId: 'civil',
    organizer: 'host1',
    capacity: 500,
    registeredStudents: ['student1', 'student2', 'student3'],
    feedback: [],
    venueId: 'venue1',
    status: 'upcoming',
    imageUrl: 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
];