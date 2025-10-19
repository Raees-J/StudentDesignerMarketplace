// src/api/customerService.ts
import axiosInstance from './axiosInstance';

export interface Customer {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    paymentMethod?: string;
}

export const registerCustomer = async (customerData: Customer) => {
    const response = await axiosInstance.post('/customer/create', customerData);
    return response.data;
};

export const loginCustomer = async (credentials: { email: string; password: string }) => {
    const response = await axiosInstance.post('/customer/login', credentials);
    return response.data;
};

export const getCustomer = async (id: string) => {
    const response = await axiosInstance.get(`/customer/read/${id}`);
    return response.data;
};

export const updateCustomer = async (customerData: Customer) => {
    const response = await axiosInstance.put('/customer/update', customerData);
    return response.data;
};

export const deleteCustomer = async (id: string) => {
    const response = await axiosInstance.delete(`/customer/delete/${id}`);
    return response.data;
};

export const getAllCustomers = async () => {
    const response = await axiosInstance.get('/customer/getAll');
    return response.data;
};

export const findCustomersByPaymentMethod = async (paymentMethod: string) => {
    const response = await axiosInstance.get(`/customer/findByPaymentMethod?paymentMethod=${encodeURIComponent(paymentMethod)}`);
    return response.data;
};