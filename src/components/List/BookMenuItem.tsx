import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';

interface BookMenuItemProps {
  title: string;
  coverImage: any;
  onPress: () => void;
}

const BookMenuItem: React.FC<BookMenuItemProps> = ({ title, coverImage, onPress }) => {
  // Animation shared values
  const pressed = useSharedValue(0);
  const animationProgress = useSharedValue(0);

  // Trigger entrance animation on mount
  React.useEffect(() => {
    animationProgress.value = withTiming(1, { duration: 600 });
  }, []);

  // Card scale animation
  const animatedCardStyle = useAnimatedStyle(() => {
    const scale = interpolate(pressed.value, [0, 1], [1, 0.95], Extrapolate.CLAMP);

    // Entrance animation
    const translateY = interpolate(animationProgress.value, [0, 1], [30, 0], Extrapolate.CLAMP);

    const opacity = interpolate(animationProgress.value, [0, 1], [0, 1], Extrapolate.CLAMP);

    return {
      transform: [{ scale }, { translateY }],
      opacity,
    };
  });

  // Text animation
  const animatedTextStyle = useAnimatedStyle(() => {
    const translateX = interpolate(pressed.value, [0, 1], [0, 5], Extrapolate.CLAMP);

    return {
      transform: [{ translateX }],
    };
  });

  // Handle press events
  const handlePressIn = () => {
    pressed.value = withSpring(1, { damping: 6, stiffness: 100 });
  };

  const handlePressOut = () => {
    pressed.value = withSpring(0, { damping: 6, stiffness: 100 });
  };

  const handlePress = () => {
    runOnJS(onPress)();
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handlePress}>
      <Animated.View style={[styles.container, animatedCardStyle]}>
        <ImageBackground
          source={{ uri: coverImage }}
          style={styles.backgroundImage}
          imageStyle={styles.image}
        >
          <View style={styles.overlay}>
            <Animated.Text style={[styles.title, animatedTextStyle]}>{title}</Animated.Text>
          </View>
        </ImageBackground>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 140,
    borderRadius: 16,
    marginVertical: 10,
    marginHorizontal: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  image: {
    borderRadius: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default BookMenuItem;
