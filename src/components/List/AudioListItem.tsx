import { MalamImage, TawheedImage } from '@assets/Images';
import { AudioIcon, ChevronRight, ClockIcon, DownloadIcon, PauseIcon, PlayIcon } from '@assets/svg';

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Share,
  Animated,
} from 'react-native';
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulsing animation effect
  useEffect(() => {
    if (isDownloading) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      );

      pulseAnimation.start();

      return () => {
        pulseAnimation.stop();
        pulseAnim.setValue(1);
      };
    } else {
      pulseAnim.setValue(1);
    }
  }, [isDownloading, pulseAnim]);

  const downloadAudio = async () => {
    if (isDownloading) return; // Prevent multiple downloads

    setIsDownloading(true);
    setError(null);

    // Generate filename from URL or use title
    const timestamp = new Date().getTime();
    const filename = `${title?.replace(/\s+/g, '_')}_${timestamp}.mp3`;

    try {
      const { dirs } = RNFetchBlob.fs;

      if (Platform.OS === 'ios') {
        const filePath = `${dirs.DocumentDir}/${filename}`;

        const task = RNFetchBlob.config({
          fileCache: true,
          path: filePath,
        }).fetch('GET', url);

        const res = await task;

        setIsDownloading(false);
        console.log('Download complete:', res.path());

        // Share the file
        await Share.share({ url: `file://${res.path()}` });
      } else {
        // Android implementation
        const task = RNFetchBlob.config({
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            title: `${title || 'Audio'}`,
            description: 'Audio download in progress',
            mime: 'audio/mpeg',
            mediaScannable: true,
            path: `${dirs.DownloadDir}/${filename}`,
          },
        }).fetch('GET', url);

        const res = await task;

        setIsDownloading(false);
        console.log('Android Download complete:', res.path());
      }
    } catch (error) {
      setIsDownloading(false);
      console.error('Download error:', error);
      setError('Download failed');
    }
  };

  return (
    <View className="flex-row w-full bg-white rounded-xl shadow mb-3 overflow-hidden">
      <View className="flex-row items-center w-full p-3">
        {/* Left section - Download button */}
        <Animated.View
          style={[
            {
              opacity: pulseAnim,
            },
          ]}
        >
          <TouchableOpacity
            onPress={downloadAudio}
            disabled={isDownloading}
            className={`w-[50px] h-[50px] ${
              isDownloading ? 'bg-blue-500' : 'bg-green-800'
            } rounded-full mr-3 justify-center items-center relative`}
          >
            {isDownloading ? (
              <View style={styles.downloadProgress}>
                <Text style={styles.downloadProgressText}>...</Text>
              </View>
            ) : (
              <DownloadIcon color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Content section */}
        <View className="flex-1 justify-between py-1">
          {/* Top section with badge */}
          <View className="flex-row justify-between items-start">
            <View className="flex-1 pr-4">
              <Text className="text-lg font-semibold text-black">{title}</Text>
              {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
            </View>
          </View>
        </View>

        {/* Right play/pause button */}
        <TouchableOpacity
          onPress={() => onPress()}
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
