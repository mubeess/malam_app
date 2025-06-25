import { MalamImage, TawheedImage } from '@assets/Images';
import { AudioIcon, ChevronRight, ClockIcon, DownloadIcon } from '@assets/svg';
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

const AudioListItem = ({
  title = 'Daurar Ilimin Hadisi - 2022',
  totalTracks = 7,
  downloads = '8.3k',
  date = 'Aug 22nd 22',
  mosque = "Gwallaga Juma'at Mosque",
  hasCompleteFiles = true,
  description,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row w-full bg-white rounded-xl shadow mb-3 overflow-hidden"
    >
      <View className="flex-row items-center w-full p-3">
        {/* Left section - Thumbnail with music icon overlay */}
        <View className="w-24 h-24 bg-gray-200 rounded-lg mr-3 justify-center items-center relative">
          <Image source={MalamImage} className="w-full h-full absolute rounded-lg" />
          <View className="absolute top-2 left-2 bg-green-700 w-8 h-8 rounded-full justify-center items-center">
            <AudioIcon color="#fff" />
          </View>
        </View>

        {/* Content section */}
        <View className="flex-1 justify-between py-1">
          {/* Top section with badge */}
          <View className="flex-row justify-between items-start">
            <View className="flex-1 pr-4">
              <Text className="text-lg font-semibold text-black">{title}</Text>
            </View>
          </View>

          {/* Mosque name with icon */}
        </View>

        {/* Right chevron */}
        <ChevronRight />
      </View>
    </TouchableOpacity>
  );
};

export default AudioListItem;
