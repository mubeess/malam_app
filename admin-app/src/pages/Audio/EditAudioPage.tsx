import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AudioForm from './AudioForm';
import { fetchAudioReferenceById, updateAudioReference } from '../../api/audioApi';
import type { AudioReference } from '../../api/types';

// Type for form data, matching what AudioForm provides.
type AudioUpdateData = Omit<AudioReference, 'id' | 'createdAt' | 'updatedAt'>;

const EditAudioPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [audioReference, setAudioReference] = useState<AudioReference | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Audio Reference ID is missing from URL.');
      setLoading(false);
      return;
    }

    const getAudioDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedAudioReference = await fetchAudioReferenceById(Number(id));
        setAudioReference(fetchedAudioReference);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred while fetching audio reference details.');
        }
      } finally {
        setLoading(false);
      }
    };

    getAudioDetails();
  }, [id]);

  const handleSubmit = async (formData: AudioUpdateData) => {
    if (!id) {
      setError('Cannot update audio reference without an ID.');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await updateAudioReference(Number(id), formData);
      navigate('/audio');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while updating the audio reference.');
      }
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-600 text-lg p-10">Loading audio reference details...</p>
    );
  }

  if (error && !audioReference) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-end mb-6">
          <Link to="/audio" className="text-blue-600 hover:text-blue-800">
            &larr; Back to Audio List
          </Link>
        </div>
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!audioReference) {
    return <p className="text-center text-red-600 text-lg p-10">Audio reference not found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Edit Audio Reference</h1>
        <Link
          to="/audio"
          className="text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out"
        >
          &larr; Back to Audio List
        </Link>
      </div>

      {error && ( // Display error related to submission, if any
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <AudioForm
        initialData={audioReference}
        onSubmit={handleSubmit}
        isSaving={isSaving}
        submitButtonText="Update Audio Reference"
      />
    </div>
  );
};

export default EditAudioPage;
