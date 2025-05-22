import axiosInstance from '../axiosInstance';
import { Post } from '../types';

export const postFetcher = async (): Promise<Post[]> => {
  const response = await axiosInstance.get<Post[]>('/posts');
  return response.data;
};
