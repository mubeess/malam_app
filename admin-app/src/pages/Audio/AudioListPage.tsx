import React, { useEffect, useState, useCallback } from 'react'; // Added useCallback
import { Link, useNavigate } from 'react-router-dom';
import { fetchAudioReferences, deleteAudioReference } from '../../api/audioApi'; // Imported deleteAudioReference
import { AudioReference } from '../../api/types';

const AudioListPage: React.FC = () => {
  const [audioReferences, setAudioReferences] = useState<AudioReference[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // For initial page load
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false); // For delete operation
  const navigate = useNavigate();

  const loadAudioReferences = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAudioReferences();
      setAudioReferences(response.data || []);
      setError(null); // Clear previous errors
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while fetching audio references.');
      }
    } finally {
      setLoading(false);
    }
  }, []); // useCallback to memoize loadAudioReferences

  useEffect(() => {
    loadAudioReferences();
  }, [loadAudioReferences]);

  const handleEditAudio = (id: string | number) => {
    navigate(`/audio/edit/${id}`);
  };

  const handleDeleteAudio = async (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this audio reference?')) {
      setIsDeleting(true);
      setError(null); // Clear previous messages
      try {
        await deleteAudioReference(Number(id));
        await loadAudioReferences(); // Re-fetch to update list
        // Optionally set a success message here if needed
        // setError("Audio reference deleted successfully."); // Example success message
      } catch (err) {
        if (err instanceof Error) {
          setError(`Failed to delete audio reference: ${err.message}`);
        } else {
          setError('An unknown error occurred while deleting the audio reference.');
        }
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Audio Management</h1>
        <Link
          to="/audio/new"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
        >
          Create New Audio Reference
        </Link>
      </div>

      {/* Display messages: loading, deleting, error */}
      {loading && !isDeleting && <p className="text-center text-gray-600 text-lg">Loading audio references...</p>}
      {isDeleting && <p className="text-center text-gray-600 text-lg">Deleting audio reference...</p>}
      {error && (
        <p className={`text-center p-3 rounded-lg text-lg ${error.startsWith('Failed to delete') ? 'text-red-600 bg-red-100' : (error.includes('successfully') ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100')}`}>
          {error}
        </p>
      )}
      
      {!loading && !error && audioReferences.length === 0 && (
        <p className="text-center text-gray-600 text-lg">No audio references found. <Link to="/audio/new" className="text-green-600 hover:underline">Add one now!</Link></p>
      )}

      {!loading && audioReferences.length > 0 && (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Book ID</th>
                <th className="py-3 px-4 text-left">Speaker</th>
                <th className="py-3 px-4 text-left">Language</th>
                <th className="py-3 px-4 text-left">Duration</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {audioReferences.map((audio) => (
                <tr key={audio.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-4">{audio.id}</td>
                  <td className="py-3 px-4">{audio.title}</td>
                  <td className="py-3 px-4">{audio.bookId || 'N/A'}</td>
                  <td className="py-3 px-4">{audio.speaker || 'N/A'}</td>
                  <td className="py-3 px-4">{audio.language || 'N/A'}</td>
                  <td className="py-3 px-4">{audio.duration || 'N/A'}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleEditAudio(audio.id)}
                      disabled={isDeleting} // Disable button when an operation is in progress
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-md mr-2 text-sm transition duration-150 ease-in-out disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAudio(audio.id)}
                      disabled={isDeleting} // Disable button when an operation is in progress
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md text-sm transition duration-150 ease-in-out disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AudioListPage;
