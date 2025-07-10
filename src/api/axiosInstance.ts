import axios from 'axios';

// export const API_URL = 'https://malam-backend.onrender.com';
export const API_URL = 'https://prod-crimson-dream-6220.fly.dev';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
