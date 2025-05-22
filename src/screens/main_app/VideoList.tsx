import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import VideoListItem from '@amukhtar/components/List/VideoListItem';
import Video, { VideoRef } from 'react-native-video';
import { MalamImage } from '@assets/Images';
import VideoPlayer from '@amukhtar/components/VideoPlayer';
import { useSelector } from 'react-redux';
import { RootState } from '@amukhtar/redux';
import { useVideo } from '@amukhtar/hooks/useVideo';
import SkeletonLoader from '@amukhtar/components/Loaders/SkeletonLoader';

export default function VideoList({ route }) {
  const id = useSelector((data: RootState) => data.book.id);

  const { getVideoReferencesByBookId, loading, allVideoReferences } = useVideo();

  useEffect(() => {
    if (id) {
      getVideoReferencesByBookId(id);
    }
  }, [id]);

  const videos = [
    {
      id: '1',
      thumbnail: '/api/placeholder/400/220',
      title: 'Nasheed covers | slowed+reverb | Lofi Covers | Jahan Mubarak',
      channelName: 'Jahan Mubarak',
      views: '274K',
      timeAgo: '1 month ago',
      duration: '17:38',
      channelAvatar: '/api/placeholder/48/48',
      url: 'https://res.cloudinary.com/nutscoders/video/upload/v1745645553/Safsims/hq5xfe35ufwyxablapxa.mp4',
    },
    {
      id: '2',
      thumbnail: '/api/placeholder/400/220',
      title: 'Islamic Recitations | Peaceful Nasheeds | Evening Reflection',
      channelName: 'Jahan Mubarak',
      views: '156K',
      timeAgo: '3 months ago',
      duration: '21:45',
      channelAvatar: '/api/placeholder/48/48',
      url: 'https://res.cloudinary.com/nutscoders/video/upload/v1745648990/Safsims/pb5ehzsuizdwy0yvqn18.mp4',
    },
    {
      id: '3',
      thumbnail: '/api/placeholder/400/220',
      title: 'Top 10 Beautiful Nasheeds | Compilation 2023 | With Subtitles',
      channelName: 'Jahan Mubarak',
      views: '412K',
      timeAgo: '2 weeks ago',
      duration: '32:18',
      channelAvatar: '/api/placeholder/48/48',
      url: 'https://res.cloudinary.com/nutscoders/video/upload/v1745645553/Safsims/hq5xfe35ufwyxablapxa.mp4',
    },
  ];
  const [url, setUrl] = useState(allVideoReferences?.length ? allVideoReferences[0].url : '');
  const [description, setDescription] = useState('');
  useEffect(() => {
    if (allVideoReferences?.length) {
      setUrl(allVideoReferences[0].url);
      setDescription(`${allVideoReferences[0].title} | ${allVideoReferences[0].description}`);
    }
  }, [allVideoReferences]);
  // Render loading state
  if (loading) {
    return <SkeletonLoader count={8} />;
  }

  // Render empty state
  if (!allVideoReferences || allVideoReferences.length === 0) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center p-4">
        <Text className="text-xl font-bold text-gray-800 mb-2">No Video Available</Text>
        <Text className="text-gray-900 text-center">
          There are no video available for this book at the moment.
        </Text>
      </View>
    );
  }
  return (
    <View className="flex-1 bg-gray-500">
      <VideoPlayer
        url={url}
        poster={MalamImage}
        height={250}
        width="100%"
        description={description}
      />
      <ScrollView className="flex-1 p-4">
        {allVideoReferences?.map((video) => (
          <VideoListItem
            key={video.id}
            {...video}
            onPress={() => {
              setUrl(video.url);
              setDescription(`${video.title} | ${video.description}`);
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}
