import { useState, useEffect } from 'react';
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
      progressUpdateEventInterval: 2, // seconds between position updates
    });

    console.log('Track Player initialized');
    return true;
  } catch (error) {
    console.error('Error setting up the player:', error);
    return false;
  }
};

interface UseTrackPlayerResult {
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
}

export const useTrackPlayer = (): UseTrackPlayerResult => {
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.Off);
  const [volume, setVolume] = useState<number>(1.0);
  const [error, setError] = useState<string | null>(null);

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
    if (event.type === Event.PlaybackActiveTrackChanged && event.track !== undefined) {
      const track = await TrackPlayer.getTrack(event.index);
      setCurrentTrack(track);
    }
  });

  useTrackPlayerEvents([Event.PlaybackError], (event) => {
    if (event.type === Event.PlaybackError) {
      setError(`Playback error: ${event.message}`);
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

  // Return the hook API
  return {
    // State
    isPlayerReady,
    isPlaying,
    currentTrack,
    queue,
    progress,
    repeatMode,
    volume,
    error,

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
  };
};
