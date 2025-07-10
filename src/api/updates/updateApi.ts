import axiosInstance from '../axiosInstance';

export const updateFetcher = async () => {
  const response = await axiosInstance.get('/updates');
  return response.data;
};
