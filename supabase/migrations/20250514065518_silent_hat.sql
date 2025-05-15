/*
  # Initial Schema Setup for CampusEvents

  1. New Tables
    - `users`: Base table for all user types
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `first_name` (text)
      - `last_name` (text)
      - `role` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `students`: Extended profile for student users
      - `user_id` (uuid, foreign key)
      - `usn` (text, unique)
      - `year` (integer)
      - `branch_id` (uuid, foreign key)

    - `branches`: Academic departments/branches
      - `id` (uuid, primary key)
      - `name` (text)
      - `code` (text)

    - `venues`: Event venues
      - `id` (uuid, primary key)
      - `name` (text)
      - `location` (text)
      - `capacity` (integer)
      - `resources` (text[])

    - `events`: Campus events
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `date` (date)
      - `time` (time)
      - `branch_id` (uuid, foreign key)
      - `venue_id` (uuid, foreign key)
      - `organizer_id` (uuid, foreign key)
      - `capacity` (integer)
      - `status` (text)
      - `image_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `event_registrations`: Student event registrations
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key)
      - `student_id` (uuid, foreign key)
      - `registered_at` (timestamptz)
      - `status` (text)

    - `event_feedback`: Event feedback from students
      - `id` (uuid, primary key)
      - `event_id` (uuid, foreign key)
      - `student_id` (uuid, foreign key)
      - `rating` (integer)
      - `comment` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Policies for different user roles
    - Secure password handling
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'student', 'host')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Branches table
CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  usn text UNIQUE NOT NULL,
  year integer NOT NULL CHECK (year BETWEEN 1 AND 4),
  branch_id uuid REFERENCES branches(id) ON DELETE RESTRICT,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Venues table
CREATE TABLE IF NOT EXISTS venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  capacity integer NOT NULL CHECK (capacity > 0),
  resources text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  branch_id uuid REFERENCES branches(id) ON DELETE RESTRICT,
  venue_id uuid REFERENCES venues(id) ON DELETE RESTRICT,
  organizer_id uuid REFERENCES users(id) ON DELETE RESTRICT,
  capacity integer NOT NULL CHECK (capacity > 0),
  status text NOT NULL CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  registered_at timestamptz DEFAULT now(),
  status text NOT NULL CHECK (status IN ('registered', 'cancelled')) DEFAULT 'registered',
  UNIQUE(event_id, student_id)
);

-- Event feedback table
CREATE TABLE IF NOT EXISTS event_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, student_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Branches policies
CREATE POLICY "Branches are viewable by all"
  ON branches FOR SELECT
  TO authenticated
  USING (true);

-- Students policies
CREATE POLICY "Students can view their own profile"
  ON students FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Students can update their own profile"
  ON students FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Venues policies
CREATE POLICY "Venues are viewable by all"
  ON venues FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and hosts can manage venues"
  ON venues FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'host')
    )
  );

-- Events policies
CREATE POLICY "Events are viewable by all"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Hosts can manage their own events"
  ON events FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (role = 'host' AND id = events.organizer_id)
    )
  );

CREATE POLICY "Admins can manage all events"
  ON events FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Event registrations policies
CREATE POLICY "Students can view their registrations"
  ON event_registrations FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Students can register for events"
  ON event_registrations FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = student_id
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'student'
    )
  );

CREATE POLICY "Students can cancel their registrations"
  ON event_registrations FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id);

-- Event feedback policies
CREATE POLICY "Feedback is viewable by all"
  ON event_feedback FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Students can add feedback to attended events"
  ON event_feedback FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = student_id
    AND EXISTS (
      SELECT 1 FROM event_registrations
      WHERE event_id = event_feedback.event_id
      AND student_id = auth.uid()
      AND status = 'registered'
    )
  );

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_venues_updated_at
    BEFORE UPDATE ON venues
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();