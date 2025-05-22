import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AudioForm from './AudioForm';
import { createAudioReference } from '../../api/audioApi';
import type { AudioReference } from '../../api/types';

// Define the type for the data expected by createAudioReference
type AudioCreationData = Omit<AudioReference, 'id' | 'createdAt' | 'updatedAt'>;

const CreateAudioPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: AudioCreationData) => {
    setIsSaving(true);
    setError(null);
    try {
      await createAudioReference(formData);
      navigate('/audio');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while creating the audio reference.');
      }
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Create New Audio Reference</h1>
        <Link
          to="/audio"
          className="text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out"
        >
          &larr; Back to Audio List
        </Link>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <AudioForm
        onSubmit={handleSubmit}
        isSaving={isSaving}
        submitButtonText="Create Audio Reference"
      />
    </div>
  );
};

export default CreateAudioPage;
