import { MalamImage, TawheedImage } from '@assets/Images';
import { AudioIcon, ChevronRight, ClockIcon, DownloadIcon, PauseIcon, PlayIcon } from '@assets/svg';

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, Share } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
const AudioListItem = ({
  title = 'Daurar Ilimin Hadisi - 2022',
  totalTracks = 7,
  downloads = '8.3k',
  date = 'Aug 22nd 22',
  mosque = "Gwallaga Juma'at Mosque",
  hasCompleteFiles = true,
  description,
  onPress,
  url,
  isPlaying,
}) => {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const downloadAudio = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    // Generate filename from URL or use title
    const timestamp = new Date().getTime();
    const filename = `${title?.replace(/\s+/g, '_')}_${timestamp}.mp3`;

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
            title: `${title || 'Audio'}`,
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
  return (
    <View className="flex-row w-full bg-white rounded-xl shadow mb-3 overflow-hidden">
      <View className="flex-row items-center w-full p-3">
        {/* Left section - Thumbnail with music icon overlay */}
        <TouchableOpacity
          onPress={downloadAudio}
          className="w-[50px] h-[50px] bg-green-800 rounded-full mr-3 justify-center items-center relative"
        >
          {isDownloading ? (
            <View style={styles.downloadProgress}>
              <Text style={styles.downloadProgressText}>{Math.round(downloadProgress * 100)}%</Text>
            </View>
          ) : (
            <DownloadIcon color="#FFFFFF" />
          )}
        </TouchableOpacity>

        {/* Content section */}
        <View className="flex-1 justify-between py-1">
          {/* Top section with badge */}
          <View className="flex-row justify-between items-start">
            <View className="flex-1 pr-4">
              <Text className="text-lg font-semibold text-black">{title}</Text>
            </View>
          </View>

          {/* Mosque name with icon */}
        </View>

        {/* Right chevron */}
        <TouchableOpacity
          onPress={onPress}
          className="w-[50px] h-[50px] justify-center items-center"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </TouchableOpacity>
      </View>
    </View>
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
});
export default AudioListItem;
