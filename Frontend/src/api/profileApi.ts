import axiosInstance from './axiosInstance';

// ==================== TYPES ====================

// Admin
export interface Admin {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Customer
export interface Customer {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  paymentMethod?: string;
  role?: 'Customer';
}

export interface CustomerLoginRequest {
  email: string;
  password: string;
}

// ==================== ADMIN SECTION ====================

// Authentication
export const registerAdmin = async (adminData: Admin) => {
  const response = await axiosInstance.post('/admins/register', adminData);
  return response.data;
};

export const loginAdmin = async (credentials: LoginCredentials) => {
  const response = await axiosInstance.post('/admins/login', credentials);
  return response.data;
};

// CRUD
export const getAllAdmins = async () => (await axiosInstance.get('/admins/all')).data;
export const getAdminById = async (id: number) => (await axiosInstance.get(`/admins/read/${id}`)).data;
export const updateAdmin = async (adminData: Admin) => (await axiosInstance.post('/admins/update', adminData)).data;
export const deleteAdmin = async (id: number) => (await axiosInstance.delete(`/admins/delete/${id}`)).data;

// ==================== CUSTOMER SECTION ====================

// Authentication
export const registerCustomer = async (customerData: Customer) => {
  try {
    console.log('Attempting customer registration with:', customerData.email);

    // Ensure role defaults to "Customer"
    const payload = { ...customerData, role: 'Customer' };

    const response = await axiosInstance.post('/customer/create', payload);
    console.log('Customer registration response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Customer registration error:', error);

    if (error.response?.status === 409) throw new Error('Email already exists');
    if (error.response?.status === 400) throw new Error('Invalid registration data');
    if (error.code === 'ECONNREFUSED') throw new Error('Cannot connect to backend server');

    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const loginCustomer = async (credentials: CustomerLoginRequest) => {
  try {
    console.log('Attempting customer login with:', credentials.email);

    const response = await axiosInstance.post('/customer/login', credentials);
    console.log('Customer login response:', response.data);

    return response.data;
  } catch (error: any) {
    console.error('Customer login error:', error);

    if (error.response?.status === 401) throw new Error('Invalid customer credentials');
    if (error.response?.status === 404) throw new Error('Customer login endpoint not found');
    if (error.code === 'ECONNREFUSED') throw new Error('Cannot connect to backend server');

    throw new Error(error.response?.data?.message || 'Customer login failed');
  }
};

// CRUD
export const createCustomer = registerCustomer; // alias
export const getCustomer = async (id: string) => (await axiosInstance.get(`/customer/read/${id}`)).data;
export const updateCustomer = async (customerData: Customer) => (await axiosInstance.put('/customer/update', customerData)).data;
export const deleteCustomer = async (id: string) => (await axiosInstance.delete(`/customer/delete/${id}`)).data;
export const getAllCustomers = async () => (await axiosInstance.get('/customer/getAll')).data;

// ==================== PROFILE SECTION ====================

export const getProfile = async (email: string) => (await axiosInstance.get(`/profile?email=${encodeURIComponent(email)}`)).data;
export const updateProfile = async (email: string, profileData: any) => (await axiosInstance.put(`/profile?email=${encodeURIComponent(email)}`, profileData)).data;
export const changePassword = async (email: string, oldPassword: string, newPassword: string) =>
    (await axiosInstance.post(`/profile/change-password?email=${encodeURIComponent(email)}`, { oldPassword, newPassword })).data;
export const deleteAccount = async (email: string) => (await axiosInstance.delete(`/profile?email=${encodeURIComponent(email)}`)).data;

// ==================== EXPORTS ====================

export default {
  // Admin
  registerAdmin,
  loginAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,

  // Customer
  registerCustomer,
  createCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  getAllCustomers,
  loginCustomer,

  // Profile
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
};
