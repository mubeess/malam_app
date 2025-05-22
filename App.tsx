import 'nativewind';
import './global.css';
import AnimatedSplashScreen from '@amukhtar/screens/splash_screen/AnimatedSplashScreen';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigation from '@amukhtar/navigations/AppNavigation';
import { setupPlayer } from '@amukhtar/hooks/useTrackPlayer';
import { AudioPlayerProvider } from '@amukhtar/context/audio/AudioPlayerContext';
import { Provider } from 'react-redux';
import store from '@amukhtar/redux';

export default function App() {
  const [visible, setVisible] = useState(true);

  return (
    <>
      {visible ? (
        <AnimatedSplashScreen
          onAnimationEnd={() => {
            setVisible(false);
          }}
        />
      ) : (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Provider store={store}>
            <AudioPlayerProvider>
              <AppNavigation />
            </AudioPlayerProvider>
          </Provider>
        </GestureHandlerRootView>
      )}
    </>
  );
}
