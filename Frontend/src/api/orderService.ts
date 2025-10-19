import axios from "./axiosInstance";

// Create a new order
export const createOrder = async (orderData: any) => {
  const response = await axios.post("/orders/create", orderData);
  return response.data;
};

// Get all orders
export const getAllOrders = async () => {
  const response = await axios.get("/orders/all");
  return response.data;
};

// Optionally, add more order-related API functions as needed
