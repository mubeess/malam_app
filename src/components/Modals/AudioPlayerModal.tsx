import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  Pressable,
  Platform,
  PermissionsAndroid,
  Share,
  StyleSheet,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { formatTime } from '@amukhtar/utils/timeFormatter';
import { Track } from 'react-native-track-player';
import { MalamImage, TawheedImage } from '@assets/Images';
import { DownloadIcon } from '@assets/svg';
import RNFetchBlob from 'rn-fetch-blob';
// You'll need to implement this utility
interface AudioPlayerModalProps {
  visible: boolean;
  onClose: () => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: {
    position: number;
    duration: number;
    buffered: number;
  };
  onPlayPause: () => Promise<void>;
  onSeek: (position: number) => Promise<void>;
  onSkipForward?: () => void;
  onSkipBackward?: () => void;
  onSkipToNext: () => Promise<void>;
  onSkipToPrevious: () => Promise<void>;
  onRewind10: () => void;
  onForward10: () => void;
  onShowPlaylist: () => void;
}
const AudioPlayerModal = ({
  visible,
  onClose,
  currentTrack,
  isPlaying,
  progress,
  onPlayPause,
  onSeek,
  onSkipForward,
  onSkipBackward,
  onSkipToNext,
  onSkipToPrevious,
  onRewind10,
  onForward10,
  onShowPlaylist,
}: AudioPlayerModalProps) => {
  // Format the time from seconds to MM:SS
  const position = formatTime(progress.position);
  const duration = formatTime(progress.duration);
  const [error, setError] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadAudio = async () => {
    // Check permissions for Android
    // if (Platform.OS === 'android') {
    //   try {
    //     // For Android 13+ (API level 33+), we need to request specific media permissions
    //     if (Platform.Version >= 33) {
    //       const granted = await PermissionsAndroid.request(
    //         PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO, // For audio files
    //         {
    //           title: 'Media Access Permission',
    //           message: 'App needs access to your media to download audio',
    //           buttonNeutral: 'Ask Me Later',
    //           buttonNegative: 'Cancel',
    //           buttonPositive: 'OK',
    //         }
    //       );
    //       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
    //         console.log('Media permission denied');
    //         return;
    //       }
    //     }
    //     // For Android 10+ (API level 29+) but below 33
    //     else if (Platform.Version >= 29) {
    //       // For Android 10+, we don't need WRITE_EXTERNAL_STORAGE when using MediaStore
    //       // or Download Manager, so we can proceed without requesting it
    //     }
    //     // For Android 9 and below
    //     else {
    //       const granted = await PermissionsAndroid.request(
    //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //         {
    //           title: 'Storage Permission',
    //           message: 'App needs access to your storage to download audio',
    //           buttonNeutral: 'Ask Me Later',
    //           buttonNegative: 'Cancel',
    //           buttonPositive: 'OK',
    //         }
    //       );
    //       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
    //         console.log('Storage permission denied');
    //         return;
    //       }
    //     }
    //   } catch (err) {
    //     console.warn(err);
    //     return;
    //   }
    // }

    // Start download
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
          .fetch('GET', currentTrack?.url)
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
          .fetch('GET', currentTrack?.url)
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
  return (
    <Modal
      style={{ flex: 1 }}
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-[rgba(0,0,0,0.5)] justify-end">
        <View className="bg-white h-[70%] rounded-t-xl">
          {/* Header with dropdown icon */}
          <View className="px-4 py-2 flex-row justify-between items-center">
            <Text className="text-2xl font-bold text-black max-w-[90%]" numberOfLines={1}>
              {currentTrack?.title || 'Now Playing'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <View className="p-2">
                <Text className="text-black text-3xl">▼</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Subtitle */}
          <Text className="px-4 text-black text-lg" numberOfLines={1}>
            {currentTrack?.artist || 'Unknown Artist'}
          </Text>

          {/* Image container */}
          <View className="flex-1 justify-center items-center px-4 py-6">
            <Image source={MalamImage} className="w-full h-full rounded-lg" resizeMode="contain" />
          </View>

          {/* Progress bar */}
          <View className="px-6 mb-2">
            <Slider
              value={progress.position}
              minimumValue={0}
              maximumValue={progress.duration > 0 ? progress.duration : 1}
              minimumTrackTintColor="#F9C33F" // Yellow color from the image
              maximumTrackTintColor="#D1D5DB"
              thumbTintColor="#F9C33F"
              onSlidingComplete={onSeek}
            />
            <View className="flex-row justify-between">
              <Text className="text-gray-500">{position}</Text>
              <Text className="text-gray-500">{duration}</Text>
            </View>
          </View>

          {/* Control buttons */}
          <View className="flex-row justify-center items-center px-4 mb-8">
            {/* Button to show playlist */}

            <TouchableOpacity
              style={styles.controlButton}
              onPress={downloadAudio}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <View style={styles.downloadProgress}>
                  <Text style={styles.downloadProgressText}>
                    {Math.round(downloadProgress * 100)}%
                  </Text>
                </View>
              ) : (
                <DownloadIcon color="#FFFFFF" />
              )}
            </TouchableOpacity>

            {/* Skip previous */}
            <TouchableOpacity onPress={onSkipToPrevious} className="mx-2">
              <View className="p-2">
                <Text className="text-4xl text-black">⏮</Text>
              </View>
            </TouchableOpacity>

            {/* Rewind 10 seconds */}

            {/* Play/Pause button */}
            <TouchableOpacity
              onPress={onPlayPause}
              className="mx-4 bg-black rounded-full w-16 h-16 justify-center items-center"
            >
              <Text className="text-white text-3xl">{isPlaying ? '⏸' : '▶'}</Text>
            </TouchableOpacity>

            {/* Skip next */}
            <TouchableOpacity onPress={onSkipToNext} className="mx-2">
              <View className="p-2">
                <Text className="text-4xl text-black">⏭</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
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
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default AudioPlayerModal;
