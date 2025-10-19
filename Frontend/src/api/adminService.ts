import axiosInstance from './axiosInstance';

export interface Admin {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string; // Ensure password is optional
    role?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

// Admin Registration
export const registerAdmin = async (adminData: Admin) => {
    try {
        const response = await axiosInstance.post('/admins/register', adminData);
        return response.data;
    } catch (error: any) {
        console.error('Admin registration error:', error);
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            'Admin registration failed'
        );
    }
};

// Admin Login
export const loginAdmin = async (credentials: LoginCredentials) => {
    try {
        const response = await axiosInstance.post('/admins/login', credentials);
        return response.data;
    } catch (error: any) {
        console.error('Admin login error:', error);
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            'Admin login failed'
        );
    }
};

// Get All Admins
export const getAllAdmins = async () => {
    try {
        const response = await axiosInstance.get('/admins/all');
        return response.data;
    } catch (error: any) {
        console.error('Error fetching all admins:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch admins');
    }
};

// Get Admin by ID
export const getAdminById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/admins/read/${id}`);
        return response.data;
    } catch (error: any) {
        console.error(`Error fetching admin with ID ${id}:`, error);
        throw new Error(error.response?.data?.message || 'Admin not found');
    }
};

// Update Admin
export const updateAdmin = async (adminData: Admin) => {
    try {
        // Create a copy of adminData to avoid mutating the original
        const updateData = { ...adminData };
        // If password is empty or undefined, remove it from the payload
        if (!updateData.password) {
            delete updateData.password; // Safe to delete since password is optional
        }
        const response = await axiosInstance.post('/admins/update', updateData);
        return response.data;
    } catch (error: any) {
        console.error('Error updating admin:', error);
        throw new Error(error.response?.data?.message || 'Failed to update admin');
    }
};

// Delete Admin
export const deleteAdmin = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/admins/delete/${id}`);
        return response.data;
    } catch (error: any) {
        console.error(`Error deleting admin with ID ${id}:`, error);
        throw new Error(error.response?.data?.message || 'Failed to delete admin');
    }
};

// Ping Admin Backend
export const pingAdminBackend = async () => {
    try {
        const response = await axiosInstance.get('/admins/ping');
        return response.data;
    } catch (error: any) {
        console.error('Admin backend ping error:', error);
        throw new Error(error.response?.data?.message || 'Admin backend ping failed');
    }
};