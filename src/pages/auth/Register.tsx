import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card, { CardContent, CardHeader } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';

const Register: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    usn: '',
    year: '',
    branch: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'role' && value === 'host' && {
        usn: '',
        year: '',
        branch: '',
      }),
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) throw new Error('First name is required');
    if (!formData.lastName.trim()) throw new Error('Last name is required');
    if (!formData.email.trim()) throw new Error('Email is required');
    if (!formData.password) throw new Error('Password is required');
    if (formData.password.length < 6) throw new Error('Password must be at least 6 characters');
    if (formData.password !== formData.confirmPassword) throw new Error('Passwords do not match');
    
    if (formData.role === 'student') {
      if (!formData.usn.trim()) throw new Error('USN/Roll Number is required');
      if (!formData.year) throw new Error('Year is required');
      if (!formData.branch) throw new Error('Branch is required');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      validateForm();

      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.role
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // 2. Insert user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: formData.role,
        });

      if (profileError) throw profileError;

      // 3. If student, insert student details
      if (formData.role === 'student') {
        const { error: studentError } = await supabase
          .from('students')
          .insert({
            user_id: authData.user.id,
            usn: formData.usn,
            year: parseInt(formData.year),
            branch_id: formData.branch,
          });

        if (studentError) throw studentError;
      }

      // Success - redirect to login
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please sign in with your new account.' 
        }
      });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto my-12 px-4">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <UserPlus size={32} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create a new account</h1>
            <p className="mt-2 text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in
              </Link>
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
              />
              
              <Select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                options={[
                  { value: 'student', label: 'Student' },
                  { value: 'host', label: 'Event Host' },
                ]}
                required
              />
              
              {formData.role === 'student' && (
                <>
                  <Input
                    label="USN/Roll Number"
                    name="usn"
                    value={formData.usn}
                    onChange={handleChange}
                    required
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Year"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      options={[
                        { value: '1', label: '1st Year' },
                        { value: '2', label: '2nd Year' },
                        { value: '3', label: '3rd Year' },
                        { value: '4', label: '4th Year' },
                      ]}
                      required
                    />
                    
                    <Select
                      label="Branch"
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      options={[
                        { value: 'cse', label: 'Computer Science Engineering' },
                        { value: 'ece', label: 'Electronics and Communication' },
                        { value: 'mech', label: 'Mechanical Engineering' },
                        { value: 'civil', label: 'Civil Engineering' },
                      ]}
                      required
                    />
                  </div>
                </>
              )}
              
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
              
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
              
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    terms and conditions
                  </a>
                </label>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                fullWidth
                className="mt-6"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Register;