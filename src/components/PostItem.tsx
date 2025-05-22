import { Post } from '@amukhtar/api/types';
import { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedView = Animated.createAnimatedComponent(View);

const PostItem = ({
  item,
  handlePostPress,
  isSelected,
  index = 0,
}: {
  item: Post;
  handlePostPress: (item: Post) => void;
  isSelected: boolean;
  index?: number;
}) => {
  const contentHeight = useSharedValue(0);
  const cardScale = useSharedValue(1);

  const expandStyle = useAnimatedStyle(() => ({
    height: contentHeight.value,
    opacity: contentHeight.value > 0 ? 1 : 0,
    overflow: 'hidden',
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  useEffect(() => {
    if (isSelected) {
      contentHeight.value = withTiming(150, { duration: 300 });
      cardScale.value = withSpring(1.02);
    } else {
      contentHeight.value = withTiming(0, { duration: 250 });
      cardScale.value = withSpring(1);
    }
  }, [isSelected]);

  const entryDelay = index * 100;

  return (
    <AnimatedTouchableOpacity
      entering={FadeInDown.delay(entryDelay).springify()}
      style={cardStyle}
      className={`mb-4 rounded-lg shadow-md border-t border-t-blue-900 ${
        isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-white'
      }`}
      onPress={() => handlePostPress(item)}
      activeOpacity={0.7}
    >
      <View className="p-4">
        <View className="flex-row items-center justify-between">
          <Text
            className="text-lg font-semibold text-black-800 flex-1 mr-2"
            numberOfLines={isSelected ? undefined : 2}
          >
            {item.title}
          </Text>
          <Text className="text-sm text-blue-600 font-medium">#{item.id}</Text>
        </View>
        {!isSelected && (
          <Text className="text-blue-900 font-bold text-[12px]">Tap to read more</Text>
        )}
        {isSelected ? (
          <AnimatedView style={expandStyle} className="mt-3 w-full">
            <Text
              numberOfLines={6}
              ellipsizeMode="tail"
              className="text-black text-[14px] leading-[20px] text-justify"
              style={{ textAlign: 'justify' }} // important!
            >
              {item.body}
            </Text>

            <View className="mt-3 flex-row justify-between items-center">
              <Text className="text-sm font-bold text-black-500">User ID: {item.userId}</Text>
            </View>
          </AnimatedView>
        ) : null}
      </View>
    </AnimatedTouchableOpacity>
  );
};

export default PostItem;
