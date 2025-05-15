/*
  # Allow public user registration

  1. Security Changes
    - Add policy to allow public users to create accounts
    - Add policy to allow users to read their own profile
    - Add policy to allow users to update their own profile

  2. Changes
    - Enable RLS on users table
    - Add policies for user management
*/

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public users to create accounts
CREATE POLICY "Allow public users to create accounts"
ON users
FOR INSERT
TO public
WITH CHECK (true);

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow students to create their profile
CREATE POLICY "Students can create their profile"
ON students
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow students to read their own profile
CREATE POLICY "Students can read own profile"
ON students
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow students to update their own profile
CREATE POLICY "Students can update own profile"
ON students
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);