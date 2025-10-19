import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/StudentDesignerMarketplace',
  withCredentials: true, // If using cookies/session
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
