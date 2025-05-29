import axiosInstance from './axiosInstance';
import type { UserSchema } from './types';

export const login = async (user: UserSchema): Promise<UserSchema> => {
  const response = await axiosInstance.post<UserSchema>('/auth/login', user);
  return response.data;
};
