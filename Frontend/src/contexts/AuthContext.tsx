import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { loginAdmin, loginCustomer, registerCustomer, registerAdmin } from '../api/profileApi';

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'user' | 'superadmin';
}

interface AuthContextType {
  currentUser: User | null;
  role: 'admin' | 'user' | 'superadmin' | null;
  loading: boolean;
  login: (email: string, password: string, loginRole?: 'admin' | 'user') => Promise<boolean>;
  logout: () => void;
  register: (
      name: string,
      email: string,
      password: string,
      role?: 'admin' | 'user'
  ) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'user' | 'superadmin' | null>(null);
  const [loading, setLoading] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedRole = localStorage.getItem('userRole');
    if (savedUser && savedRole) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setRole(savedRole as 'admin' | 'user' | 'superadmin');
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userRole');
      }
    }
  }, []);

  const login = async (email: string, password: string, loginRole: 'admin' | 'user' = 'user'): Promise<boolean> => {
    setLoading(true);
    try {
      let response;
      if (loginRole === 'admin') {
        response = await loginAdmin({ email, password });
      } else {
        response = await loginCustomer({ email, password });
      }

      if (response && (response.success || response.id || response.email)) {
        const userData: User = {
          id: response.id?.toString() || response.userId?.toString() || email,
          email: response.email || email,
          name: response.name || `${response.firstName || ''} ${response.lastName || ''}`.trim() || 'User',
          firstName: response.firstName,
          lastName: response.lastName,
          role: loginRole,
        };

        setCurrentUser(userData);
        setRole(loginRole);

        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('userRole', loginRole);

        toast.success(`Welcome back, ${userData.name}!`);
        return true;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
      name: string,
      email: string,
      password: string,
      role: 'admin' | 'user' = 'user'
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ') || '';

      let response;
      if (role === 'admin') {
        const adminData = { firstName, lastName, email, password };
        response = await registerAdmin(adminData);
      } else {
        const customerData = { firstName, lastName, email, password };
        response = await registerCustomer(customerData);
      };

      if (response && (response.success || response.id || response.email)) {
        // Automatically log in newly registered user
        await login(email, password, role);

        toast.success(`Welcome, ${name}! Your account has been created.`);
        return true;
      }

      throw new Error('Registration failed');
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
    setCurrentUser(null);
    setRole(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    toast.success('Logged out successfully');
  };

  return (
      <AuthContext.Provider value={{ currentUser, role, loading, login, logout, register }}>
        {children}
      </AuthContext.Provider>
  );
};
