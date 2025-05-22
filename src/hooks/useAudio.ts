import { useState } from 'react';
import {
  fetchAudioReferences,
  fetchAudioReferencesByBookId,
  fetchAudioReferenceById,
  createAudioReference,
  updateAudioReference,
  deleteAudioReference,
} from '@amukhtar/api/audio/audioApi';
import { AudioReference } from '@amukhtar/api/types';

export const useAudio = () => {
  const [loading, setLoading] = useState(false);
  const [allAudioReferences, setAllAudioReferences] = useState<AudioReference[] | []>([]);
  const [currentAudioReference, setCurrentAudioReference] = useState<AudioReference | null>(null);
  const [error, setError] = useState('');

  // Get all audio references
  const getAllAudioReferences = async () => {
    try {
      setLoading(true);

      const response = await fetchAudioReferences();
      setAllAudioReferences(response?.data);

      setLoading(false);
      return response;
    } catch (error) {
      console.log(error, 'loggg', 'err');
      setError('Failed to fetch audio references. Please try again later.');
      setLoading(false);
    }
  };

  // Get all audio references for a specific book
  const getAudioReferencesByBookId = async (bookId: number) => {
    try {
      console.log('started');
      setLoading(true);

      const response = await fetchAudioReferencesByBookId(bookId);
      console.log(response, 'response');
      setAllAudioReferences(response?.audio);

      setLoading(false);
      return response;
    } catch (error) {
      console.log(error, 'loggg', 'err');
      setError('Failed to fetch audio references for this book. Please try again later.');
      setLoading(false);
    }
  };

  // Get a single audio reference by ID
  const getAudioReference = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetchAudioReferenceById(id);
      setCurrentAudioReference(response);
      setLoading(false);
      return response;
    } catch (error) {
      setError('Failed to fetch audio reference. Please try again later.');
      setLoading(false);
    }
  };

  // Add a new audio reference
  const addAudioReference = async (
    audioData: Omit<AudioReference, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      setLoading(true);
      const response = await createAudioReference(audioData);
      setAllAudioReferences((prevAudioRefs) => [...prevAudioRefs, response]);
      setLoading(false);
      return response;
    } catch (error) {
      setError('Failed to add audio reference. Please try again later.');
      setLoading(false);
    }
  };

  // Update an existing audio reference
  const editAudioReference = async (id: number, audioData: Partial<AudioReference>) => {
    try {
      setLoading(true);
      const response = await updateAudioReference(id, audioData);
      setAllAudioReferences((prevAudioRefs) =>
        prevAudioRefs.map((audio) => (audio.id === id ? response : audio))
      );
      if (currentAudioReference?.id === id) {
        setCurrentAudioReference(response);
      }
      setLoading(false);
      return response;
    } catch (error) {
      setError('Failed to update audio reference. Please try again later.');
      setLoading(false);
    }
  };

  // Delete an audio reference
  const removeAudioReference = async (id: number) => {
    try {
      setLoading(true);
      await deleteAudioReference(id);
      setAllAudioReferences((prevAudioRefs) => prevAudioRefs.filter((audio) => audio.id !== id));
      if (currentAudioReference?.id === id) {
        setCurrentAudioReference(null);
      }
      setLoading(false);
      return true;
    } catch (error) {
      setError('Failed to delete audio reference. Please try again later.');
      setLoading(false);
      return false;
    }
  };

  return {
    getAllAudioReferences,
    getAudioReferencesByBookId,
    getAudioReference,
    addAudioReference,
    editAudioReference,
    removeAudioReference,
    allAudioReferences,
    currentAudioReference,
    loading,
    error,
  };
};
