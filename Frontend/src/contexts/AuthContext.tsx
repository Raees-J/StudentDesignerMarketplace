import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { login as authLogin, logout as authLogout, register as authRegister } from '../api/authService';

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: 'ADMIN' | 'CUSTOMER' | 'DESIGNER';
}

interface AuthContextType {
  currentUser: User | null;
  role: 'ADMIN' | 'CUSTOMER' | 'DESIGNER' | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (firstName: string, lastName: string, email: string, password: string, role?: 'CUSTOMER' | 'ADMIN' | 'DESIGNER') => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<'ADMIN' | 'CUSTOMER' | 'DESIGNER' | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('authToken');
    
    if (savedUser && savedRole && token) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        // Normalize stored role to uppercase to avoid mismatches
        setRole((savedRole as string).toUpperCase() as 'ADMIN' | 'CUSTOMER' | 'DESIGNER');
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
        authLogout();
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await authLogin({ email, password });
      
      if (response && response.user) {
        const normalizedRole = (response.user.role || '').toString().toUpperCase();

        const userData: User = {
          id: response.user.id,
          email: response.user.email,
          name: `${response.user.firstName || ''} ${response.user.lastName || ''}`.trim() || 'User',
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          role: normalizedRole as 'ADMIN' | 'CUSTOMER' | 'DESIGNER',
        };

        setCurrentUser(userData);
        setRole(userData.role);

        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('userRole', userData.role);

        toast.success(`Welcome back, ${userData.name}!`);
        return true;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string, role: 'CUSTOMER' | 'ADMIN' | 'DESIGNER' = 'CUSTOMER'): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await authRegister({ firstName, lastName, email, password, role });

      if (response && response.user) {
        const normalizedRole = (response.user.role || role).toString().toUpperCase();

        const userData: User = {
          id: response.user.id,
          email: response.user.email,
          name: `${firstName} ${lastName}`.trim(),
          firstName,
          lastName,
          role: normalizedRole as 'ADMIN' | 'CUSTOMER' | 'DESIGNER',
        };

        setCurrentUser(userData);
        setRole(userData.role);

        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('userRole', userData.role);

        toast.success(`Welcome, ${userData.name}! Your account has been created.`);
        return true;
      } else {
        throw new Error('Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authLogout();
    setCurrentUser(null);
    setRole(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ currentUser, role, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
