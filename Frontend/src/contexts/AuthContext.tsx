import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';
import { createCustomer } from '../api/profileApi';

interface AuthContextType {
  currentUser: any
  role: 'admin' | 'user' | null
  login: (email: string, password: string, role?: 'admin' | 'user') => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(false);

  // Example admin credentials (replace with secure backend check in production)
  const ADMIN_EMAIL = 'admin@university.com';
  const ADMIN_PASSWORD = 'admin123';

  const login = async (email: string, password: string, loginRole: 'admin' | 'user' = 'user') => {
    setLoading(true);
    try {
      if (loginRole === 'admin') {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          setRole('admin');
          setCurrentUser({ email: ADMIN_EMAIL, name: 'Admin' });
          toast.success('Admin logged in!');
          return;
        } else {
          throw new Error('Invalid admin credentials');
        }
      } else {
        // Call backend login API
        const res = await axiosInstance.post('/customer/login', { email, password });
        setCurrentUser(res.data);
        setRole('user');
        toast.success('Successfully logged in!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to log in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      await createCustomer({ email, password, name });
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    setRole(null);
    toast.success('Successfully logged out!');
  };

  const value = {
    currentUser,
    role,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
