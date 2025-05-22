import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const BookSkeleton = () => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(0.6, { duration: 500 }), withTiming(0.3, { duration: 500 })),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View className="flex-row items-center p-4 border-b border-gray-100">
      <Animated.View style={animatedStyle} className="w-[60px] h-[80px] rounded bg-gray-300" />
      <View className="flex-1 ml-4">
        <Animated.View style={animatedStyle} className="h-5 w-4/5 bg-gray-300 rounded mb-2" />
        <Animated.View style={animatedStyle} className="h-4 w-2/3 bg-gray-300 rounded" />
      </View>
    </View>
  );
};

const SkeletonLoader = ({ count = 5 }) => {
  return (
    <View>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <BookSkeleton key={`skeleton-${index}`} />
        ))}
    </View>
  );
};
export default SkeletonLoader;
