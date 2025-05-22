import { useSharedValue, withTiming } from 'react-native-reanimated';
import { SplashAnimationHookProps, SplashAnimationHookReturn } from '../types';

const useSplashAnimation = ({ onEnd }: SplashAnimationHookProps): SplashAnimationHookReturn => {
  const sharedValue = useSharedValue(1);
  const scaleYValue = useSharedValue(1);

  const startAnimation = () => {
    sharedValue.value = withTiming(7, { duration: 2000 }, (finished) => {
      if (finished) {
        scaleYValue.value = withTiming(0.4, { duration: 2000 });
      }
    });
    setTimeout(() => {
      onEnd();
    }, 3000);
  };

  return {
    sharedValue,
    scaleYValue,
    startAnimation,
  };
};

export default useSplashAnimation;
