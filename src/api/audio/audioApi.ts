import axiosInstance from '../axiosInstance';
import { AudioReference, AudioReferencesResponse } from '../types';

// Get all audio references
export const fetchAudioReferences = async (): Promise<AudioReferencesResponse> => {
  const response = await axiosInstance.get<AudioReferencesResponse>('/audio');
  return response.data;
};

// Get all audio references for a specific book
export const fetchAudioReferencesByBookId = async (
  bookId: number
): Promise<AudioReferencesResponse> => {
  const response = await axiosInstance.get<AudioReferencesResponse>(`/audio/book/${bookId}`);
  return response.data;
};

// Get a single audio reference by ID
export const fetchAudioReferenceById = async (id: number): Promise<AudioReference> => {
  const response = await axiosInstance.get<AudioReference>(`/audio/${id}`);
  return response.data;
};

// Create a new audio reference
export const createAudioReference = async (
  audioData: Omit<AudioReference, 'id' | 'createdAt' | 'updatedAt'>
): Promise<AudioReference> => {
  const response = await axiosInstance.post<AudioReference>('/audio/add', audioData);
  return response.data;
};

// Update an existing audio reference
export const updateAudioReference = async (
  id: number,
  audioData: Partial<AudioReference>
): Promise<AudioReference> => {
  const response = await axiosInstance.put<AudioReference>(`/audio/${id}`, audioData);
  return response.data;
};

// Delete an audio reference
export const deleteAudioReference = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/audio/${id}`);
};
