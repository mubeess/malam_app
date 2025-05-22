import { memo, useEffect } from 'react';
import { ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { ButtonProps } from '../types';
import { colors } from '@amukhtar/constants';

function Button({
  IconRight,
  IconLeft,
  isLoading = false,
  onPress,
  label,
  style,
  disabled = false,
  backgroundColor = colors.primary,
  fontColor = colors.white,
  testId,
  ...props
}: ButtonProps) {
  const { width } = Dimensions.get('window');
  const sharedValue = useSharedValue(-width);

  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: sharedValue.value }],
    };
  });
  const startLoading = () => {
    sharedValue.value = withRepeat(withTiming(0.5, { duration: 1000 }), -1, true);
  };
  const stopLoading = () => {
    sharedValue.value = withTiming(-width, { duration: 1000 });
  };

  useEffect(() => {
    if (isLoading) {
      startLoading();
    } else {
      stopLoading();
    }
  }, [isLoading]);
  return (
    <TouchableOpacity
      testID={testId}
      disabled={disabled}
      activeOpacity={0.7}
      onPress={onPress}
      className={`w-full h-14 mx-auto rounded-lg justify-center items-center flex-row px-2.5 relative overflow-hidden gap-2.5 ${style}`}
      style={{
        backgroundColor: disabled ? colors.disabled : backgroundColor,
      }}
      {...props}
    >
      <Animated.View
        className="absolute z-10 opacity-30 inset-0"
        style={[{ backgroundColor: 'rgba(0,0,0,0.5)' }, reanimatedStyle]}
      />
      {IconLeft && IconLeft}
      <Animated.Text
        className="text-base"
        style={{
          color: disabled ? colors.gray : fontColor,
        }}
      >
        {label}
      </Animated.Text>
      {IconRight && !isLoading && IconRight}
      {isLoading && <ActivityIndicator color="#fff" />}
    </TouchableOpacity>
  );
}

export default memo(Button);
