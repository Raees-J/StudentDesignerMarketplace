export const createCustomer = async (customerData: any) => {
  const res = await axiosInstance.post('/customer/create', customerData);
  return res.data;
};
import axiosInstance from './axiosInstance';

export const getProfile = async () => {
  const res = await axiosInstance.get('/profile');
  return res.data;
};

export const updateProfile = async (profileData: any) => {
  const res = await axiosInstance.put('/profile', profileData);
  return res.data;
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
  const res = await axiosInstance.post('/profile/change-password', { oldPassword, newPassword });
  return res.data;
};

export const deleteAccount = async () => {
  const res = await axiosInstance.delete('/profile');
  return res.data;
};
