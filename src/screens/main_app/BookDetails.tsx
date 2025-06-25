import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Share,
} from 'react-native';
import React from 'react';
import AudioListItem from '@amukhtar/components/List/AudioListItem';
import AudioPlayerModal from '@amukhtar/components/Modals/AudioPlayerModal';
import { MalamImage } from '@assets/Images';
import { useAudioPlayer } from '@amukhtar/context/audio/AudioPlayerContext';
import { useSelector } from 'react-redux';
import { RootState } from '@amukhtar/redux';
import { useBooks } from '@amukhtar/hooks/useBook';
import { useAudio } from '@amukhtar/hooks/useAudio';
import { AudioReference } from '@amukhtar/api/types';
import SkeletonLoader from '@amukhtar/components/Loaders/SkeletonLoader';
import RNFetchBlob from 'rn-fetch-blob';
export default function BookDetails() {
  const {
    isPlayerReady,
    isPlaying,
    currentTrack,
    progress,
    queue,
    play,
    pause,
    stop,
    togglePlayPause,
    addTrack,
    clearQueue,
    seekTo,
    skipToNext,
    skipToPrevious,
    addTracks,
    setCurrentAudioIndex,
    skipToTrack,
  } = useAudioPlayer();

  const id = useSelector((data: RootState) => data.book.id);
  const [activeAudioIndex, setActiveAudioIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getAudioReferencesByBookId, loading, allAudioReferences } = useAudio();
  const [error, setError] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      getAudioReferencesByBookId(id);
      clearQueue();
    }
  }, [id]);

  useEffect(() => {
    if (allAudioReferences && allAudioReferences.length > 0) {
      // Convert API audio references to track format for audio player
      const tracks = allAudioReferences.map((audio, index) => ({
        id: `track-${index}`,
        url: audio.url,
        title: audio.title,
        artist: 'Sheikh Abubakar Mukhtar',
        artwork: MalamImage,
      }));
      console.log(tracks);
      // Add all tracks to the player queue
      addTracks(tracks);
    }
  }, [allAudioReferences]);

  useEffect(() => {
    if (isPlaying) {
      play();
    }
  }, [activeAudioIndex]);

  const handleAudioPress = async (item, index) => {
    setIsLoading(true);

    try {
      // If the same audio is clicked and it's playing, pause it
      if (activeAudioIndex === index && isPlaying) {
        await pause();
      }
      // If the same audio is clicked but paused, resume playback
      else if (activeAudioIndex === index && !isPlaying) {
        await play();
      }
      // If a different audio is clicked, set to play that index
      else {
        setActiveAudioIndex(index);
        skipToTrack(index);
        // This will automatically play the track at this index
        // await skipToNext(index);
      }
    } catch (error) {
      console.error('Error handling audio press:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipForward10 = () => {
    if (progress && progress.position) {
      seekTo(progress.position + 10);
    }
  };

  const handleSkipBackward10 = () => {
    if (progress && progress.position) {
      seekTo(Math.max(0, progress.position - 10));
    }
  };
  const downloadAudio = async (url: string) => {
    setIsDownloading(true);
    setDownloadProgress(0);

    // Generate filename from URL or use title
    const timestamp = new Date().getTime();
    const filename = `${currentTrack?.title?.replace(/\s+/g, '_')}_${timestamp}.mp3`;

    try {
      // Set download directory based on platform
      const { dirs } = RNFetchBlob.fs;

      // For iOS, use DocumentDir
      if (Platform.OS === 'ios') {
        const filePath = `${dirs.DocumentDir}/${filename}`;

        RNFetchBlob.config({
          fileCache: true,
          path: filePath,
        })
          .fetch('GET', url)
          .progress((received, total) => {
            const progress = received / total;
            setDownloadProgress(progress);
          })
          .then((res) => {
            setIsDownloading(false);
            setDownloadProgress(0);
            console.log('Download complete:', res.path());

            // Share the file
            Share.share({ url: `file://${res.path()}` });
          })
          .catch((err) => {
            setIsDownloading(false);
            console.error('Download error:', err);
            setError('Download failed');
          });
      }
      // For Android
      else {
        // For Android, use the Download Manager to handle downloads
        RNFetchBlob.config({
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            title: `${currentTrack?.title || 'Audio'}`,
            description: 'Audio download in progress',
            mime: 'audio/mpeg', // Change to correct MIME type for mp3
            mediaScannable: true,
            path: `${RNFetchBlob.fs.dirs.DownloadDir}/${filename}`,
          },
        })
          .fetch('GET', url)
          .progress((received, total) => {
            const progress = received / total;
            setDownloadProgress(progress);
          })
          .then((res) => {
            setIsDownloading(false);
            setDownloadProgress(0);
            console.log('Download complete:', res.path());
          })
          .catch((err) => {
            setIsDownloading(false);
            console.error('Download error:', err);
            setError('Download failed');
          });
      }
    } catch (error) {
      setIsDownloading(false);
      console.log('General error:', error);
      setError('Download process failed');
    }
  };
  // Enhanced AudioListItem with play state
  const renderAudioItem = (item, index) => {
    const isActive = activeAudioIndex === index;

    return (
      <AudioListItem
        downloadProgress={downloadProgress}
        isDownloading={isDownloading}
        key={index}
        onPress={() => handleAudioPress(item, index)}
        onDownload={() => downloadAudio(item.url)}
        
        {...item}
        isPlaying={isActive && isPlaying}
        isLoading={isLoading && activeAudioIndex === index}
      />
    );
  };

  // Render loading state
  if (loading) {
    return <SkeletonLoader count={8} />;
  }

  // Render empty state
  if (!allAudioReferences || allAudioReferences.length === 0) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center p-4">
        <Text className="text-xl font-bold text-gray-800 mb-2">No Audio Available</Text>
        <Text className="text-gray-900 text-center">
          There are no audio available for this book at the moment.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {allAudioReferences.map((item, index) => renderAudioItem(item, index))}
      </ScrollView>
    </View>
  );
}
