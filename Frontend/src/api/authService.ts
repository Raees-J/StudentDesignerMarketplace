import axiosInstance from './axiosInstance';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'CUSTOMER' | 'ADMIN' | 'DESIGNER';
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
  };
}

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    console.log('Attempting unified login with:', credentials.email);
    
    const response = await axiosInstance.post('/auth/login', credentials);
    console.log('Unified login response:', response.data);
    
    // Store the token
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Unified login error:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Invalid credentials');
    }
    if (error.response?.status === 404) {
      throw new Error('User not found');
    }
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to backend server');
    }
    
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  try {
    console.log('Attempting unified registration with:', userData.email);
    
    const response = await axiosInstance.post('/auth/register', userData);
    console.log('Unified registration response:', response.data);
    
    // Store the token
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Unified registration error:', error);
    
    if (error.response?.status === 409 || error.response?.data?.message?.includes('already exists')) {
      throw new Error('Email already exists');
    }
    if (error.response?.status === 400) {
      throw new Error('Invalid registration data');
    }
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to backend server');
    }
    
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  } catch (error: any) {
    console.error('Get current user error:', error);
    throw new Error(error.response?.data?.message || 'Failed to get user info');
  }
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('userRole');
};