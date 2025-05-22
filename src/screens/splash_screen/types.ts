import {SharedValue} from 'react-native-reanimated';

export type SplashAnimationHookReturn = {
  sharedValue: SharedValue<number>;
  scaleYValue: SharedValue<number>;
  startAnimation: () => void;
};

export type SplashAnimationHookProps = {
  onEnd: () => void;
};
export type SplashScreenType = {
  onAnimationEnd: () => void;
};
