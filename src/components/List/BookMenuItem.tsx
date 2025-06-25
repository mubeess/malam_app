import { MalamImage, MalamImage2 } from '@assets/Images';
import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = CARD_WIDTH * 0.6;

interface BookMenuItemProps {
  title: string;
  coverImage: any;
  description?: string;
  author?: string;
  onPress: () => void;
}

const BookMenuItem: React.FC<BookMenuItemProps> = ({
  title,
  coverImage,
  onPress,
  description,
  author,
}) => {
  const pressed = useSharedValue(0);
  const animationProgress = useSharedValue(0);

  React.useEffect(() => {
    animationProgress.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  const animatedCardStyle = useAnimatedStyle(() => {
    const scale = interpolate(pressed.value, [0, 1], [1, 0.98]);
    const translateY = interpolate(animationProgress.value, [0, 1], [50, 0]);
    const opacity = animationProgress.value;

    return {
      transform: [{ scale }, { translateY }],
      opacity,
      shadowOpacity: interpolate(pressed.value, [0, 1], [0.2, 0.4]),
    };
  });

  const animatedContentStyle = useAnimatedStyle(() => {
    const translateX = interpolate(pressed.value, [0, 1], [0, 4]);
    return { transform: [{ translateX }] };
  });

  const handlePressIn = () => {
    pressed.value = withSpring(1, { damping: 10, stiffness: 400 });
  };

  const handlePressOut = () => {
    pressed.value = withSpring(0, { damping: 10, stiffness: 400 });
  };

  const handlePress = () => {
    runOnJS(onPress)();
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handlePress}>
      <Animated.View style={[styles.container, animatedCardStyle]}>
        <ImageBackground
          source={coverImage ? { uri: coverImage } : MalamImage2}
          style={styles.backgroundImage}
          imageStyle={styles.image}
        >
          <Animated.View style={[styles.contentContainer, animatedContentStyle]}>
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={2}>
                {title}
              </Text>
              {author && <Text style={styles.author}>by {author}</Text>}
              {description && (
                <Text style={styles.description} numberOfLines={2}>
                  {description}
                </Text>
              )}
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Listen Now</Text>
            </View>
          </Animated.View>
          <View style={styles.gradientOverlay} />
        </ImageBackground>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 16,
    marginVertical: 12,
    alignSelf: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 8,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  image: {
    borderRadius: 16,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
  },
  contentContainer: {
    padding: 20,
    zIndex: 2,
  },
  textContainer: {
    marginBottom: 12,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  author: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  badgeText: {
    color: '#222',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default BookMenuItem;
