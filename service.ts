import TrackPlayer, { Event } from 'react-native-track-player';

// Headless service to handle remote/lockscreen/notification controls on Android (and iOS)
// This runs when the app is in background or killed, so keep logic minimal and side-effect free.
// Do not import React code here.
//
// Note: We intentionally use CommonJS export so `require('./service')` works in index.js.
// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = async function () {
  TrackPlayer.addEventListener(Event.RemotePlay, async () => {
    try {
      await TrackPlayer.play();
    } catch (e) {
      // no-op
    }
  });

  TrackPlayer.addEventListener(Event.RemotePause, async () => {
    try {
      await TrackPlayer.pause();
    } catch (e) {
      // no-op
    }
  });

  TrackPlayer.addEventListener(Event.RemoteStop, async () => {
    try {
      await TrackPlayer.stop();
    } catch (e) {
      // no-op
    }
  });

  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (e) {
      // no-op
    }
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (e) {
      // no-op
    }
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, async (event) => {
    try {
      await TrackPlayer.seekTo(event.position);
    } catch (e) {
      // no-op
    }
  });

  // Handle audio focus changes on Android
  TrackPlayer.addEventListener(Event.RemoteDuck, async (event) => {
    try {
      if (event.paused) {
        await TrackPlayer.pause();
      } else if (event.permanent) {
        await TrackPlayer.stop();
      } else {
        await TrackPlayer.play();
      }
    } catch (e) {
      // no-op
    }
  });

  // Optional: log errors
  TrackPlayer.addEventListener(Event.PlaybackError, (event) => {
    // eslint-disable-next-line no-console
    console.warn('TrackPlayer PlaybackError (service):', event);
  });
};


