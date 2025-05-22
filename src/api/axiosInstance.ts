import axios from 'axios';

export const API_URL = 'https://3032-102-91-92-12.ngrok-free.app';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
