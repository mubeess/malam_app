import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import TrackPlayer, {
  State,
  usePlaybackState,
  useTrackPlayerEvents,
  Event,
  RepeatMode,
  useProgress,
  Track,
  AddTrack,
  Capability,
} from 'react-native-track-player';
import { AppState, Platform } from 'react-native';

// Setup function that should be called once in your app
export const setupPlayer = async (): Promise<boolean> => {
  try {
    await TrackPlayer.setupPlayer();

    await TrackPlayer.updateOptions({
      // Media controls capabilities
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      // Capabilities that will show up when the notification is in the compact form
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      // Android notification settings
      android: {
        foregroundService: {
          notificationCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.Stop,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
          notificationColor: '#CCCCCC',
          notificationIcon: 'notification_icon',
        },
      },
      // iOS background capabilities
      iosCategory: 'playback',
      iosCategoryOptions: ['mixWithOthers', 'duckOthers'],
      progressUpdateEventInterval: 2, // seconds between position updates
    });

    console.log('Track Player initialized');
    return true;
  } catch (error) {
    console.error('Error setting up the player:', error);
    return false;
  }
};

// Define the context interface
interface AudioPlayerContextType {
  // State
  isPlayerReady: boolean;
  isPlaying: boolean;
  currentTrack: Track | null;
  queue: Track[];
  progress: {
    position: number;
    duration: number;
    buffered: number;
  };
  repeatMode: RepeatMode;
  volume: number;
  error: string | null;
  modalVisible: boolean;
  currentAudioIndex: number | null;
  isLoading: boolean;

  // Actions
  addTrack: (track: AddTrack) => Promise<boolean>;
  addTracks: (tracks: AddTrack[]) => Promise<boolean>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  skipToNext: () => Promise<void>;
  skipToPrevious: () => Promise<void>;
  seekTo: (seconds: number) => Promise<void>;
  clearQueue: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  toggleRepeatMode: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  skipToTrack: (trackIndex: number) => Promise<void>;
  setModalVisible: (visible: boolean) => void;
  setCurrentAudioIndex: (index: number | null) => void;
  setIsLoading: (loading: boolean) => void;
  handleAudioPress: (item: any, index: number) => Promise<void>;
  handleSkipForward10: () => void;
  handleSkipBackward10: () => void;
}

// Create the context with a default undefined value
const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

// Props interface for the provider
interface AudioPlayerProviderProps {
  children: ReactNode;
}

// Provider component
export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.Off);
  const [volume, setVolume] = useState<number>(1.0);
  const [error, setError] = useState<string | null>(null);
  const [wasPlayingBeforeInterruption, setWasPlayingBeforeInterruption] = useState<boolean>(false);

  // New state variables
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const playbackState = usePlaybackState();
  const progress = useProgress();

  // Initialize player
  useEffect(() => {
    const initializePlayer = async (): Promise<void> => {
      try {
        const ready = await setupPlayer();
        setIsPlayerReady(ready);
      } catch (error) {
        setError(`Error initializing player: ${(error as Error).message}`);
      }
    };

    initializePlayer();

    // Cleanup function
    return () => {
      // Reset player when component unmounts
      TrackPlayer.reset();
    };
  }, []);

  // Handle app state changes for background playback
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState === 'active') {
        // App coming to foreground
        // You can add any foreground-specific logic here
      } else if (nextAppState === 'background') {
        // App going to background
        // Ensure playback continues in background if needed
        if (isPlaying) {
          // You might want to update notification or other background-specific settings here
        }
      }
    };

    // Subscribe to app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup
    return () => {
      subscription.remove();
    };
  }, [isPlaying]);

  // Track playback state changes
  useEffect(() => {
    if (playbackState.state === State.Playing) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [playbackState]);

  // Listen for track player events
  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async (event) => {
    if (
      event.type === Event.PlaybackActiveTrackChanged &&
      event.track !== undefined &&
      event.index !== undefined
    ) {
      const track = await TrackPlayer.getTrack(event.index);
      if (track) {
        setCurrentTrack(track);
      }
    }
  });

  useTrackPlayerEvents([Event.PlaybackError], (event) => {
    if (event.type === Event.PlaybackError) {
      setError(`Playback error: ${event.message}`);
    }
  });

  // Handle audio interruptions
  useTrackPlayerEvents([Event.RemoteDuck], async (event) => {
    if (event.type === Event.RemoteDuck) {
      if (event.paused) {
        // Something else started playing audio and we should pause
        setWasPlayingBeforeInterruption(isPlaying);
        if (isPlaying) {
          await TrackPlayer.pause();
        }
      } else if (event.permanent) {
        // We've permanently lost audio focus
        await TrackPlayer.stop();
      } else {
        // We've regained focus, resume playback if needed
        if (wasPlayingBeforeInterruption) {
          await TrackPlayer.play();
          await TrackPlayer.setVolume(1.0);
        }
      }
    }
  });

  // Methods to control audio playback
  const addTrack = async (track: AddTrack): Promise<boolean> => {
    if (!isPlayerReady) return false;

    try {
      await TrackPlayer.add(track);
      const updatedQueue = await TrackPlayer.getQueue();
      setQueue(updatedQueue);
      return true;
    } catch (error) {
      setError(`Error adding track: ${(error as Error).message}`);
      return false;
    }
  };

  const addTracks = async (tracks: AddTrack[]): Promise<boolean> => {
    if (!isPlayerReady) return false;

    try {
      await TrackPlayer.add(tracks);
      const updatedQueue = await TrackPlayer.getQueue();
      setQueue(updatedQueue);
      return true;
    } catch (error) {
      setError(`Error adding tracks: ${(error as Error).message}`);
      return false;
    }
  };

  const play = async (): Promise<void> => {
    if (!isPlayerReady) return;

    try {
      await TrackPlayer.play();
    } catch (error) {
      setError(`Error playing: ${(error as Error).message}`);
    }
  };

  const pause = async (): Promise<void> => {
    if (!isPlayerReady) return;

    try {
      await TrackPlayer.pause();
    } catch (error) {
      setError(`Error pausing: ${(error as Error).message}`);
    }
  };

  const stop = async (): Promise<void> => {
    if (!isPlayerReady) return;

    try {
      await TrackPlayer.stop();
    } catch (error) {
      setError(`Error stopping: ${(error as Error).message}`);
    }
  };

  const skipToNext = async (): Promise<void> => {
    if (!isPlayerReady) return;

    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      setError(`Error skipping to next: ${(error as Error).message}`);
    }
  };

  const skipToPrevious = async (): Promise<void> => {
    if (!isPlayerReady) return;

    try {
      await TrackPlayer.skipToPrevious();
    } catch (error) {
      setError(`Error skipping to previous: ${(error as Error).message}`);
    }
  };

  const seekTo = async (seconds: number): Promise<void> => {
    if (!isPlayerReady) return;

    try {
      await TrackPlayer.seekTo(seconds);
    } catch (error) {
      setError(`Error seeking: ${(error as Error).message}`);
    }
  };

  const clearQueue = async (): Promise<void> => {
    if (!isPlayerReady) return;

    try {
      await TrackPlayer.reset();
      setQueue([]);
      setCurrentTrack(null);
    } catch (error) {
      setError(`Error clearing queue: ${(error as Error).message}`);
    }
  };

  const togglePlayPause = async (): Promise<void> => {
    if (!isPlayerReady) return;

    try {
      if (isPlaying) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    } catch (error) {
      setError(`Error toggling play/pause: ${(error as Error).message}`);
    }
  };

  const toggleRepeatMode = async (): Promise<void> => {
    if (!isPlayerReady) return;

    try {
      const nextMode =
        repeatMode === RepeatMode.Off
          ? RepeatMode.Track
          : repeatMode === RepeatMode.Track
          ? RepeatMode.Queue
          : RepeatMode.Off;

      await TrackPlayer.setRepeatMode(nextMode);
      setRepeatMode(nextMode);
    } catch (error) {
      setError(`Error setting repeat mode: ${(error as Error).message}`);
    }
  };

  const setPlayerVolume = async (newVolume: number): Promise<void> => {
    if (!isPlayerReady) return;

    try {
      // Ensure volume is between 0 and 1
      const clampedVolume = Math.min(Math.max(newVolume, 0), 1);
      await TrackPlayer.setVolume(clampedVolume);
      setVolume(clampedVolume);
    } catch (error) {
      setError(`Error setting volume: ${(error as Error).message}`);
    }
  };

  const skipToTrack = async (trackIndex: number): Promise<void> => {
    if (!isPlayerReady) return;

    try {
      await TrackPlayer.skip(trackIndex);
    } catch (error) {
      setError(`Error skipping to track: ${(error as Error).message}`);
    }
  };

  // New methods for handling audio items
  const handleAudioPress = async (item: any, index: number): Promise<void> => {
    console.log('handleAudioPress called:', {
      index,
      currentAudioIndex,
      isPlaying,
      item,
      isPlayerReady,
    });

    if (!isPlayerReady) {
      console.log('Player not ready, cannot handle audio press');
      setError('Audio player is not ready yet. Please try again.');
      return;
    }

    setIsLoading(true);
    try {
      // If the same audio is clicked and it's playing, pause it
      if (currentAudioIndex === index && isPlaying) {
        console.log('Pausing current track');
        await pause();
      }
      // If the same audio is clicked but paused, resume playback
      else if (currentAudioIndex === index && !isPlaying) {
        console.log('Resuming current track');
        await play();
      }
      // If a different audio is clicked, ensure it's in the queue and play it
      else {
        console.log('Switching to different track');
        // Check if the queue is empty or if we need to add tracks
        const currentQueue = await TrackPlayer.getQueue();
        console.log('Current queue length:', currentQueue.length);

        if (currentQueue.length === 0) {
          // Queue is empty, add the track and play it
          console.log('Queue is empty, adding track');
          const track = {
            id: `track-${index}`,
            url: item.url,
            title: item.title,
            artist: item.mosque || 'Unknown',
            artwork: item.artwork,
          };

          const added = await addTrack(track);
          if (added) {
            setCurrentAudioIndex(index);
            console.log('Track added, starting playback');
            await play();
          } else {
            console.error('Failed to add track');
          }
        } else if (index < currentQueue.length) {
          // Track exists in queue, skip to it
          console.log('Track exists in queue, skipping to index:', index);
          setCurrentAudioIndex(index);
          await skipToTrack(index);
          await play(); // Explicitly call play to ensure it starts
        } else {
          // Index is out of bounds, add the track to the end and play it
          console.log('Index out of bounds, adding track to end');
          const track = {
            id: `track-${index}`,
            url: item.url,
            title: item.title,
            artist: item.mosque || 'Unknown',
            artwork: item.artwork,
          };

          const added = await addTrack(track);
          if (added) {
            setCurrentAudioIndex(index);
            console.log('Track added to end, starting playback');
            await play();
          } else {
            console.error('Failed to add track to end');
          }
        }
      }
    } catch (error) {
      console.error('Error in handleAudioPress:', error);
      setError(`Error handling audio press: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipForward10 = (): void => {
    if (progress && progress.position) {
      seekTo(progress.position + 10);
    }
  };

  const handleSkipBackward10 = (): void => {
    if (progress && progress.position) {
      seekTo(Math.max(0, progress.position - 10));
    }
  };

  // Context value
  const value: AudioPlayerContextType = {
    // State
    isPlayerReady,
    isPlaying,
    currentTrack,
    queue,
    progress,
    repeatMode,
    volume,
    error,
    modalVisible,
    currentAudioIndex,
    isLoading,

    // Actions
    addTrack,
    addTracks,
    play,
    pause,
    stop,
    skipToNext,
    skipToPrevious,
    seekTo,
    clearQueue,
    togglePlayPause,
    toggleRepeatMode,
    setVolume: setPlayerVolume,
    skipToTrack,
    setModalVisible,
    setCurrentAudioIndex,
    setIsLoading,
    handleAudioPress,
    handleSkipForward10,
    handleSkipBackward10,
  };

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>;
};

// Custom hook to use the audio player context
export const useAudioPlayer = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
