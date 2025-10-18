import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/StudentDesignerMarketplace',
  headers: {
    'Content-Type': 'application/json',
  },
  // No credentials are sent by default. Enabling them without matching
  // server-side CORS settings causes browsers to reject requests and surface
  // generic "Registration failed" errors in the UI.
});

export default axiosInstance;
