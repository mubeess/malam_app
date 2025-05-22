import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainAppStack from './stack/MainAppStack';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAudioPlayer } from '@amukhtar/context/audio/AudioPlayerContext';
import AudioPlayerModal from '@amukhtar/components/Modals/AudioPlayerModal';

export default function AppNavigation() {
  const {
    isPlayerReady,
    isPlaying,
    currentTrack,
    progress,
    modalVisible,
    setModalVisible,
    currentAudioIndex,
    isLoading,
    togglePlayPause,
    handleAudioPress,
    handleSkipForward10,
    handleSkipBackward10,
    seekTo,
    skipToNext,
    skipToPrevious,
  } = useAudioPlayer();
  return (
    <>
      <NavigationContainer>
        <MainAppStack />
      </NavigationContainer>
      {currentTrack && !modalVisible && (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="absolute bottom-0 left-0 right-0 bg-white p-3 border-t border-gray-200 flex-row items-center justify-between"
        >
          <View className="flex-1">
            <Text className="text-lg font-bold" numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text className="text-green-900" numberOfLines={1}>
              {currentTrack.artist}
            </Text>
          </View>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation(); // Prevent modal from opening
              togglePlayPause();
            }}
            className="ml-2 bg-black rounded-full w-10 h-10 flex items-center justify-center"
          >
            <Text className="text-white text-lg">{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
      <AudioPlayerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        progress={progress}
        onPlayPause={togglePlayPause}
        onSeek={seekTo}
        onSkipToNext={skipToNext}
        onSkipToPrevious={skipToPrevious}
        onRewind10={handleSkipBackward10}
        onForward10={handleSkipForward10}
        onShowPlaylist={() => console.log('Show playlist')}
      />
    </>
  );
}
