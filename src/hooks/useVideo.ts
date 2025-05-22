import { useState } from 'react';
import {
  fetchVideoReferencesByBookId,
  fetchVideoReferenceById,
  createVideoReference,
  updateVideoReference,
  deleteVideoReference,
  searchVideoReferences,
} from '@amukhtar/api/video/videoApi';
import { VideoReference } from '@amukhtar/api/types';

export const useVideo = () => {
  const [loading, setLoading] = useState(false);
  const [allVideoReferences, setAllVideoReferences] = useState<VideoReference[] | []>([]);
  const [currentVideoReference, setCurrentVideoReference] = useState<VideoReference | null>(null);
  const [error, setError] = useState('');

  // Get all video references for a specific book
  const getVideoReferencesByBookId = async (bookId: number) => {
    try {
      setLoading(true);

      const response = await fetchVideoReferencesByBookId(bookId);
      setAllVideoReferences(response.videos);
      console.log(response, 'response');
      setLoading(false);
      return response;
    } catch (error) {
      console.error(error, 'Error fetching video references');
      setError('Failed to fetch video references for this book. Please try again later.');
      setLoading(false);
    }
  };

  // Get a single video reference by ID
  const getVideoReference = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetchVideoReferenceById(id);
      setCurrentVideoReference(response);
      setLoading(false);
      return response;
    } catch (error) {
      setError('Failed to fetch video reference. Please try again later.');
      setLoading(false);
    }
  };

  // Add a new video reference
  const addVideoReference = async (
    videoData: Omit<VideoReference, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      setLoading(true);
      const response = await createVideoReference(videoData);
      setAllVideoReferences((prevVideoRefs) => [...prevVideoRefs, response]);
      setLoading(false);
      return response;
    } catch (error) {
      setError('Failed to add video reference. Please try again later.');
      setLoading(false);
    }
  };

  // Update an existing video reference
  const editVideoReference = async (id: number, videoData: Partial<VideoReference>) => {
    try {
      setLoading(true);
      const response = await updateVideoReference(id, videoData);
      setAllVideoReferences((prevVideoRefs) =>
        prevVideoRefs.map((video) => (video.id === id ? response : video))
      );
      if (currentVideoReference?.id === id) {
        setCurrentVideoReference(response);
      }
      setLoading(false);
      return response;
    } catch (error) {
      setError('Failed to update video reference. Please try again later.');
      setLoading(false);
    }
  };

  // Delete a video reference
  const removeVideoReference = async (id: number) => {
    try {
      setLoading(true);
      await deleteVideoReference(id);
      setAllVideoReferences((prevVideoRefs) => prevVideoRefs.filter((video) => video.id !== id));
      if (currentVideoReference?.id === id) {
        setCurrentVideoReference(null);
      }
      setLoading(false);
      return true;
    } catch (error) {
      setError('Failed to delete video reference. Please try again later.');
      setLoading(false);
      return false;
    }
  };

  // Search video references
  const searchVideos = async (query: string) => {
    try {
      setLoading(true);
      const response = await searchVideoReferences(query);
      setAllVideoReferences(response.video);
      setLoading(false);
      return response;
    } catch (error) {
      setError('Failed to search video references. Please try again later.');
      setLoading(false);
    }
  };

  return {
    getVideoReferencesByBookId,
    getVideoReference,
    addVideoReference,
    editVideoReference,
    removeVideoReference,
    searchVideos,
    allVideoReferences,
    currentVideoReference,
    loading,
    error,
  };
};
