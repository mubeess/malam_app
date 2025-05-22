import { DownloadIcon, PauseIcon, PlayIcon } from '@assets/svg';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Text,
  Platform,
  PermissionsAndroid,
  Share,
} from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import RNFetchBlob from 'rn-fetch-blob';

interface VideoPlayerProps {
  url: string;
  poster: any; // Can be a require() or uri object
  height?: number;
  width?: string | number;
  title?: string;
}

const VideoPlayer = ({
  url,
  poster,
  height = 250,
  width = '100%',
  title = 'Video',
  description,
}: VideoPlayerProps) => {
  const videoRef = useRef<VideoRef>(null);
  const [isBuffering, setIsBuffering] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Reset states when URL changes
  useEffect(() => {
    setIsBuffering(true);
    setInitialLoad(true);
    setError(null);
  }, [url]);

  const handleBuffer = ({ isBuffering }: { isBuffering: boolean }) => {
    setIsBuffering(isBuffering);
  };

  const handleError = (error: any) => {
    console.error('Video error:', error);
    setError('Failed to load video');
    setIsBuffering(false);
    setInitialLoad(false);
  };

  const handleLoad = () => {
    // Video has loaded enough metadata to display
    setInitialLoad(false);
    // Optional: Auto-play when enough data is loaded
    // setIsPlaying(true);
  };

  const handleProgress = (progress: {
    currentTime: number;
    playableDuration: number;
    seekableDuration: number;
  }) => {
    // You can use this to show a progress bar
    // playableDuration represents how much of the video has been buffered
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    return () => {
      togglePlayPause();
    };
  }, []);

  const downloadVideo = async () => {
    // Check permissions for Android
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage to download videos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Storage permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    // Start download
    setIsDownloading(true);
    setDownloadProgress(0);

    // Set download directory based on platform
    const { dirs } = RNFetchBlob.fs;
    const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;

    // Generate filename from URL or use title
    const timestamp = new Date().getTime();
    const filename = `${title.replace(/\s+/g, '_')}_${timestamp}.mp4`;
    const filePath = `${dirToSave}/${filename}`;

    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'mp4',
      path: filePath,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: `Downloading ${title}`,
        description: 'Video download in progress',
        mime: 'video/mp4',
        mediaScannable: true,
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

        // On iOS, we need to handle sharing the file
        if (Platform.OS === 'ios') {
          Share.share({ url: `file://${res.path()}` });
          // You can implement file sharing here using Share API
          // Share.open({ url: `file://${res.path()}` });
        }

        // For Android, the Download Manager takes care of it
      })
      .catch((err) => {
        setIsDownloading(false);
        console.error('Download error:', err);
        setError('Download failed');
      });
  };

  return (
    <View style={[styles.container, { height, width }]}>
      {/* Video Player */}
      <Video
        source={{ uri: url }}
        ref={videoRef}
        style={styles.videoPlayer}
        poster={typeof poster === 'string' ? poster : undefined}
        posterResizeMode="cover"
        resizeMode="contain"
        onBuffer={handleBuffer}
        onError={handleError}
        onLoad={handleLoad}
        onProgress={handleProgress}
        paused={!isPlaying}
        repeat={true}
        // Enable streaming buffering behavior
        bufferConfig={{
          minBufferMs: 15000, // 15 seconds of buffer
          maxBufferMs: 50000, // Max 50 seconds of buffer
          bufferForPlaybackMs: 2500, // Start playback after 2.5 seconds of buffering
          bufferForPlaybackAfterRebufferMs: 5000, // After a rebuffer, play when we have 5 seconds
        }}
      />

      {/* Loading State / Poster Image */}
      {initialLoad && (
        <View style={styles.loaderContainer}>
          {poster && <Image source={poster} style={styles.posterImage} resizeMode="contain" />}
          <View style={styles.skeletonOverlay}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.bufferingText}>
              {initialLoad ? 'Loading video...' : 'Buffering...'}
            </Text>
          </View>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Controls Overlay */}
      <View style={styles.controlsContainer}>
        {/* Play/Pause Button */}
        <TouchableOpacity style={styles.controlButton} onPress={togglePlayPause}>
          {!isPlaying ? <PlayIcon color="#FFFFFF" /> : <PauseIcon color="#FFFFFF" />}
        </TouchableOpacity>
        <Text className="text-white font-bold">{description}</Text>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={downloadVideo}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <View style={styles.downloadProgress}>
              <Text style={styles.downloadProgressText}>{Math.round(downloadProgress * 100)}%</Text>
            </View>
          ) : (
            <DownloadIcon color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  videoPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  posterImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  skeletonOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bufferingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
  },
  controlButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadProgress: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 128, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadProgressText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default VideoPlayer;
