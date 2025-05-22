import axiosInstance from '../axiosInstance';
import { VideoReference, VideoReferencesResponse } from '../types';

// Get all video references for a specific book
export const fetchVideoReferencesByBookId = async (
  bookId: number
): Promise<VideoReferencesResponse> => {
  const response = await axiosInstance.get<VideoReferencesResponse>(`/video/book/${bookId}`);
  return response.data;
};

// Get a single video reference by ID
export const fetchVideoReferenceById = async (id: number): Promise<VideoReference> => {
  const response = await axiosInstance.get<VideoReference>(`/video/${id}`);
  return response.data;
};

// Create a new video reference
export const createVideoReference = async (
  videoData: Omit<VideoReference, 'id' | 'createdAt' | 'updatedAt'>
): Promise<VideoReference> => {
  const response = await axiosInstance.post<VideoReference>('/video', videoData);
  return response.data;
};

// Update an existing video reference
export const updateVideoReference = async (
  id: number,
  videoData: Partial<VideoReference>
): Promise<VideoReference> => {
  const response = await axiosInstance.put<VideoReference>(`/video/${id}`, videoData);
  return response.data;
};

// Delete a video reference
export const deleteVideoReference = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/video/${id}`);
};

// Search video references
export const searchVideoReferences = async (query: string): Promise<VideoReferencesResponse> => {
  const response = await axiosInstance.get<VideoReferencesResponse>('/video/search', {
    params: { query },
  });
  return response.data;
};
