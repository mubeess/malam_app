import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  fetchVideoReferencesByBookId,
  createVideoReference,
  updateVideoReference,
  deleteVideoReference,
} from '../../api/videoApi';
import {
  fetchAudioReferencesByBookId,
  createAudioReference,
  updateAudioReference,
  deleteAudioReference,
} from '../../api/audioApi';
import {
  Trash2,
  Edit3,
  Plus,
  Video,
  Play,
  Search,
  ChevronLeft,
  Loader2,
  X,
  Check,
  ExternalLink,
  Filter,
  List,
  Grid,
  Headphones,
} from 'lucide-react';
import type { VideoReference, AudioReference } from '../../api/types';

type MediaTab = 'video' | 'audio';

const BookMediaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<MediaTab>('video');
  const [videos, setVideos] = useState<VideoReference[]>([]);
  const [audios, setAudios] = useState<AudioReference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<{ type: MediaTab; id: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<
    | Omit<VideoReference, 'id' | 'createdAt' | 'updatedAt'>
    | Omit<AudioReference, 'id' | 'createdAt' | 'updatedAt'>
  >({
    title: '',
    url: '',
    bookId: Number(id),
    description: '',
    duration: 0,
    ...(activeTab === 'video' ? { thumbnailUrl: '' } : {}),
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<VideoReference | AudioReference>>({});

  const loadMedia = useCallback(async () => {
    try {
      setLoading(true);
      const [videosResponse, audiosResponse] = await Promise.all([
        fetchVideoReferencesByBookId(Number(id)),
        fetchAudioReferencesByBookId(Number(id)),
      ]);
      setVideos(videosResponse.videos || []);
      setAudios(audiosResponse.audio || []);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while fetching media.');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredAudios = audios.filter((audio) =>
    audio.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (activeTab === 'video') {
        await createVideoReference(
          formData as Omit<VideoReference, 'id' | 'createdAt' | 'updatedAt'>
        );
      } else {
        await createAudioReference(
          formData as Omit<AudioReference, 'id' | 'createdAt' | 'updatedAt'>
        );
      }
      await loadMedia();
      setShowAddForm(false);
      setFormData({
        title: '',
        url: '',
        bookId: Number(id),
        description: '',
        duration: 0,
        ...(activeTab === 'video' ? { thumbnailUrl: '' } : {}),
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to add ${activeTab}: ${err.message}`);
      } else {
        setError(`An unknown error occurred while adding the ${activeTab}.`);
      }
    }
  };

  const handleEditMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      setError(null);
      if (activeTab === 'video') {
        await updateVideoReference(editingId, editFormData as Partial<VideoReference>);
      } else {
        await updateAudioReference(editingId, editFormData as Partial<AudioReference>);
      }
      await loadMedia();
      setEditingId(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to update ${activeTab}: ${err.message}`);
      } else {
        setError(`An unknown error occurred while updating the ${activeTab}.`);
      }
    }
  };

  const handleDeleteMedia = async (mediaId: number) => {
    if (window.confirm(`Are you sure you want to delete this ${activeTab} reference?`)) {
      setIsDeleting({ type: activeTab, id: mediaId });
      setError(null);
      try {
        if (activeTab === 'video') {
          await deleteVideoReference(mediaId);
        } else {
          await deleteAudioReference(mediaId);
        }
        await loadMedia();
      } catch (err) {
        if (err instanceof Error) {
          setError(`Failed to delete ${activeTab}: ${err.message}`);
        } else {
          setError(`An unknown error occurred while deleting the ${activeTab}.`);
        }
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentMedia = activeTab === 'video' ? filteredVideos : filteredAudios;
  const MediaIcon = activeTab === 'video' ? Video : Headphones;
  const mediaColor = activeTab === 'video' ? 'purple' : 'blue';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading media...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <MediaIcon className={`w-8 h-8 text-${mediaColor}-600`} />
                {activeTab === 'video' ? 'Video' : 'Audio'} References
              </h1>
            </div>
            <p className="text-gray-600 ml-9">Manage {activeTab} references for this book</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className={`bg-gradient-to-r from-${mediaColor}-600 to-${
              mediaColor === 'purple' ? 'pink' : 'cyan'
            }-600 hover:from-${mediaColor}-700 hover:to-${
              mediaColor === 'purple' ? 'pink' : 'cyan'
            }-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 justify-center sm:justify-start`}
          >
            <Plus className="w-5 h-5" />
            Add {activeTab === 'video' ? 'Video' : 'Audio'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 font-medium text-sm flex items-center gap-2 border-b-2 ${
              activeTab === 'video'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Video className="w-4 h-4" />
            Videos
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
              {videos.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`px-4 py-2 font-medium text-sm flex items-center gap-2 border-b-2 ${
              activeTab === 'audio'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Headphones className="w-4 h-4" />
            Audios
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
              {audios.length}
            </span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Search ${activeTab}s by title...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${mediaColor}-500 focus:border-transparent`}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="w-5 h-5 text-red-500 mr-3">⚠️</div>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Add Media Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Add New {activeTab === 'video' ? 'Video' : 'Audio'} Reference
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddMedia}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${mediaColor}-500 focus:border-transparent`}
                  />
                </div>
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                    URL*
                  </label>
                  <input
                    type="url"
                    id="url"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${mediaColor}-500 focus:border-transparent`}
                  />
                </div>
                {activeTab === 'video' && (
                  <div>
                    <label
                      htmlFor="thumbnailUrl"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Thumbnail URL
                    </label>
                    <input
                      type="url"
                      id="thumbnailUrl"
                      value={(formData as VideoReference).thumbnailUrl || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          thumbnailUrl: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${mediaColor}-500 focus:border-transparent`}
                    />
                  </div>
                )}
                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    min="0"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${mediaColor}-500 focus:border-transparent`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${mediaColor}-500 focus:border-transparent`}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 bg-${mediaColor}-600 hover:bg-${mediaColor}-700 text-white rounded-lg transition-colors flex items-center gap-2`}
                >
                  <Check className="w-4 h-4" />
                  Add {activeTab === 'video' ? 'Video' : 'Audio'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Edit Media Form */}
        {editingId !== null && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Edit {activeTab === 'video' ? 'Video' : 'Audio'} Reference
              </h2>
              <button
                onClick={() => setEditingId(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEditMedia}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="edit-title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Title*
                  </label>
                  <input
                    type="text"
                    id="edit-title"
                    required
                    value={
                      editFormData.title ||
                      (activeTab === 'video'
                        ? videos.find((v) => v.id === editingId)?.title
                        : audios.find((a) => a.id === editingId)?.title) ||
                      ''
                    }
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${mediaColor}-500 focus:border-transparent`}
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-url"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    URL*
                  </label>
                  <input
                    type="url"
                    id="edit-url"
                    required
                    value={
                      editFormData.url ||
                      (activeTab === 'video'
                        ? videos.find((v) => v.id === editingId)?.url
                        : audios.find((a) => a.id === editingId)?.url) ||
                      ''
                    }
                    onChange={(e) => setEditFormData({ ...editFormData, url: e.target.value })}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${mediaColor}-500 focus:border-transparent`}
                  />
                </div>
                {activeTab === 'video' && (
                  <div>
                    <label
                      htmlFor="edit-thumbnailUrl"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Thumbnail URL
                    </label>
                    <input
                      type="url"
                      id="edit-thumbnailUrl"
                      value={
                        (editFormData as VideoReference).thumbnailUrl ||
                        videos.find((v) => v.id === editingId)?.thumbnailUrl ||
                        ''
                      }
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          thumbnailUrl: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${mediaColor}-500 focus:border-transparent`}
                    />
                  </div>
                )}
                <div>
                  <label
                    htmlFor="edit-duration"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    id="edit-duration"
                    min="0"
                    value={
                      editFormData.duration ||
                      (activeTab === 'video'
                        ? videos.find((v) => v.id === editingId)?.duration
                        : audios.find((a) => a.id === editingId)?.duration) ||
                      0
                    }
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, duration: Number(e.target.value) })
                    }
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${mediaColor}-500 focus:border-transparent`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="edit-description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="edit-description"
                    rows={3}
                    value={
                      editFormData.description ||
                      (activeTab === 'video'
                        ? videos.find((v) => v.id === editingId)?.description
                        : audios.find((a) => a.id === editingId)?.description) ||
                      ''
                    }
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, description: e.target.value })
                    }
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${mediaColor}-500 focus:border-transparent`}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 bg-${mediaColor}-600 hover:bg-${mediaColor}-700 text-white rounded-lg transition-colors flex items-center gap-2`}
                >
                  <Check className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Content */}
        {currentMedia.length === 0 && !loading ? (
          <div className="text-center py-12">
            <MediaIcon className={`w-16 h-16 text-${mediaColor}-300 mx-auto mb-4`} />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm
                ? `No ${activeTab}s match your search`
                : `No ${activeTab} references for this book`}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Try adjusting your search criteria'
                : `Add ${activeTab} references to enhance this book`}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className={`bg-${mediaColor}-600 hover:bg-${mediaColor}-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 inline-flex items-center gap-2`}
            >
              <Plus className="w-4 h-4" />
              Add Your First {activeTab === 'video' ? 'Video' : 'Audio'}
            </button>
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                {currentMedia.length} {currentMedia.length === 1 ? activeTab : `${activeTab}s`}{' '}
                found
              </p>
            </div>

            {/* Media Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentMedia.map((media) => (
                  <div
                    key={media.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
                  >
                    {activeTab === 'video' && (media as VideoReference).thumbnailUrl ? (
                      <div className="h-40 bg-gray-100 overflow-hidden">
                        <img
                          src={(media as VideoReference).thumbnailUrl}
                          alt={media.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className={`h-40 bg-gradient-to-br from-${mediaColor}-100 to-${
                          mediaColor === 'purple' ? 'pink' : 'cyan'
                        }-100 flex items-center justify-center`}
                      >
                        <MediaIcon className={`w-12 h-12 text-${mediaColor}-500`} />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
                          {media.title}
                        </h3>
                        {media.duration > 0 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded ml-2">
                            {formatDuration(media.duration)}
                          </span>
                        )}
                      </div>
                      {media.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {media.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <a
                          href={media.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-${mediaColor}-600 hover:text-${mediaColor}-800 text-sm font-medium flex items-center gap-1`}
                        >
                          <Play className="w-4 h-4" />
                          {activeTab === 'video' ? 'Play' : 'Listen'}
                        </a>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingId(media.id);
                              setEditFormData({
                                title: media.title,
                                url: media.url,
                                description: media.description,
                                duration: media.duration,
                                ...(activeTab === 'video'
                                  ? { thumbnailUrl: (media as VideoReference).thumbnailUrl }
                                  : {}),
                              });
                            }}
                            className="text-gray-500 hover:text-amber-600 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMedia(media.id)}
                            disabled={isDeleting?.type === activeTab && isDeleting?.id === media.id}
                            className="text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
                          >
                            {isDeleting?.type === activeTab && isDeleting?.id === media.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {currentMedia.map((media) => (
                  <div
                    key={media.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 p-4"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {activeTab === 'video' && (media as VideoReference).thumbnailUrl ? (
                        <div className="w-full sm:w-40 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={(media as VideoReference).thumbnailUrl}
                            alt={media.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className={`w-full sm:w-40 h-24 bg-gradient-to-br from-${mediaColor}-100 to-${
                            mediaColor === 'purple' ? 'pink' : 'cyan'
                          }-100 rounded-lg flex items-center justify-center flex-shrink-0`}
                        >
                          <MediaIcon className={`w-8 h-8 text-${mediaColor}-500`} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {media.title}
                          </h3>
                          {media.duration > 0 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {formatDuration(media.duration)}
                            </span>
                          )}
                        </div>
                        {media.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {media.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <a
                            href={media.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-${mediaColor}-600 hover:text-${mediaColor}-800 text-sm font-medium flex items-center gap-1`}
                          >
                            <Play className="w-4 h-4" />
                            {activeTab === 'video' ? 'Play Video' : 'Listen to Audio'}
                          </a>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setEditingId(media.id);
                                setEditFormData({
                                  title: media.title,
                                  url: media.url,
                                  description: media.description,
                                  duration: media.duration,
                                  ...(activeTab === 'video'
                                    ? { thumbnailUrl: (media as VideoReference).thumbnailUrl }
                                    : {}),
                                });
                              }}
                              className="text-gray-500 hover:text-amber-600 transition-colors flex items-center gap-1 text-sm"
                            >
                              <Edit3 className="w-4 h-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteMedia(media.id)}
                              disabled={
                                isDeleting?.type === activeTab && isDeleting?.id === media.id
                              }
                              className="text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1 text-sm disabled:opacity-50"
                            >
                              {isDeleting?.type === activeTab && isDeleting?.id === media.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Trash2 className="w-4 h-4" />
                                  <span className="hidden sm:inline">Delete</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookMediaPage;
