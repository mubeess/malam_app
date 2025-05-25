import { IconImage, LogoImage, MalamImage, TawheedImage } from '@assets/Images';
import { ChevronRight } from '@assets/svg';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const VideoListItem = ({
  thumbnail = '',
  title = 'Nasheed covers | slowed+reverb | Lofi Covers | Jahan Mubarak',
  channelName = 'Jahan Mubarak',
  views = '274K',
  timeAgo = '1 month ago',
  duration = '17:38',
  description = '/api/placeholder/48/48',
  onPress,
}) => {
  return (
    <TouchableOpacity className="w-full mb-4" activeOpacity={0.9} onPress={onPress}>
      {/* Thumbnail with duration */}
      <View className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-200">
        <Image
          source={thumbnail ? { uri: thumbnail } : MalamImage}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-1 py-0.5 rounded">
          <Text className="text-white text-xs font-medium">{duration}</Text>
        </View>
      </View>

      {/* Video info section */}
      <View className="flex-row mt-3">
        {/* Channel avatar */}
        <View className="mr-3">
          <Image source={IconImage} className="w-10 h-10 rounded-full" />
        </View>

        {/* Title and metadata */}
        <View className="flex-1 pr-2">
          <Text className="text-base font-medium text-gray-900 mb-1" numberOfLines={2}>
            {title}
          </Text>
          <Text className="text-sm text-black">{description}</Text>
        </View>

        {/* More options button */}
        <TouchableOpacity className="self-start p-1">
          <ChevronRight />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
export default VideoListItem;
