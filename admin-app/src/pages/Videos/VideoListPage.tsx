import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAllVideoReferences, searchVideoReferences } from '../../api/videoApi';
import { VideoReference } from '../../api/types';

const VideoListPage: React.FC = () => {
  const [videoReferences, setVideoReferences] = useState<VideoReference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  const loadVideos = useCallback(async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (query && query.trim() !== '') {
        response = await searchVideoReferences(query);
      } else {
        response = await fetchAllVideoReferences();
      }
      setVideoReferences(response.data || []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while fetching video references.');
      }
      setVideoReferences([]); // Clear previous results on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load (fetch all)
    loadVideos();
  }, [loadVideos]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loadVideos(searchQuery);
  };
  
  const handleEditVideo = (id: string | number) => {
    navigate(`/videos/edit/${id}`); // Navigate to edit page (to be created)
  };

  // Placeholder for delete functionality
  const handleDeleteVideo = async (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this video reference?')) {
      // try {
      //   await deleteVideoReference(Number(id));
      //   loadVideos(searchQuery); // Refresh list
      // } catch (err) {
      //   setError(err instanceof Error ? err.message : 'Failed to delete video.');
      // }
      console.log(`Video ${id} delete action triggered.`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Video Management</h1>
        <Link
          to="/videos/new" // Link to create new video reference
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
        >
          Create New Video Reference
        </Link>
      </div>

      <form onSubmit={handleSearchSubmit} className="mb-6 flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by title, speaker, etc..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-r-md shadow-md transition duration-150 ease-in-out border border-indigo-600"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-center text-gray-600 text-lg">Loading video references...</p>}
      {error && <p className="text-center text-red-600 bg-red-100 p-3 rounded-lg text-lg">Error: {error}</p>}
      
      {!loading && !error && videoReferences.length === 0 && (
        <p className="text-center text-gray-600 text-lg">
          No video references found. 
          {searchQuery && ` For query: "${searchQuery}".`}
          <Link to="/videos/new" className="text-purple-600 hover:underline ml-1">Add one now!</Link>
        </p>
      )}

      {!loading && !error && videoReferences.length > 0 && (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Book ID</th>
                <th className="py-3 px-4 text-left">Speaker</th>
                <th className="py-3 px-4 text-left">Language</th>
                <th className="py-3 px-4 text-left">Duration (sec)</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {videoReferences.map((video) => (
                <tr key={video.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-4">{video.id}</td>
                  <td className="py-3 px-4">{video.title}</td>
                  <td className="py-3 px-4">{video.bookId || 'N/A'}</td>
                  <td className="py-3 px-4">{video.speaker || 'N/A'}</td>
                  <td className="py-3 px-4">{video.language || 'N/A'}</td>
                  <td className="py-3 px-4">{video.duration || 'N/A'}</td>
                  <td className="py-3 px-4 text-center">
                    <button 
                      onClick={() => handleEditVideo(video.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-md mr-2 text-sm transition duration-150 ease-in-out"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md text-sm transition duration-150 ease-in-out"
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

export default VideoListPage;
