import BootSplash from 'react-native-bootsplash';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';

import { StatusBar } from 'react-native';

import useSplashAnimation from './hooks/useSplashAnimation';
import { SplashScreenType } from './types';
import { colors } from '@amukhtar/constants';
import { IconImage } from '@assets/Images';

const AnimatedSplashScreen = ({ onAnimationEnd }: SplashScreenType) => {
  const { sharedValue, scaleYValue, startAnimation } = useSplashAnimation({
    onEnd: onAnimationEnd,
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    const interpoatedBackground = interpolateColor(
      scaleYValue.value,
      [1, 7],
      [colors.black, colors.black]
    );
    return {
      backgroundColor: interpoatedBackground,
    };
  });

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: sharedValue.value }],
    };
  });

  const { container, logo } = BootSplash.useHideAnimation({
    manifest: require('../../../assets/bootsplash/manifest.json'),

    logo: require('../../../assets/bootsplash/logo.png'),

    statusBarTranslucent: false,
    navigationBarTranslucent: false,

    animate: startAnimation,
  });

  return (
    <Animated.View
      testID="splash-screen"
      {...container}
      style={[container.style, animatedContainerStyle]}
    >
      <StatusBar animated backgroundColor={colors.white} />
      <Animated.Image
        {...logo}
        style={[animatedImageStyle, { height: 100, width: 100 }]}
        source={IconImage}
      />
    </Animated.View>
  );
};

export default AnimatedSplashScreen;
