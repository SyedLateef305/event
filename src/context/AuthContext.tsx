import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Admin, Student } from '../types';
import { users, admins, students } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getUserDetails: () => Admin | Student | null;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  getUserDetails: () => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is stored in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call with mock data
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const getUserDetails = () => {
    if (!currentUser) return null;
    
    if (currentUser.role === 'admin') {
      return admins.find(admin => admin.id === currentUser.id) || null;
    } else if (currentUser.role === 'student') {
      return students.find(student => student.id === currentUser.id) || null;
    }
    
    return null;
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout, getUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};