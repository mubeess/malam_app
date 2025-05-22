import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://3032-102-91-92-12.ngrok-free.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
