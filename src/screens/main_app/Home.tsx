import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState, useDeferredValue, useMemo } from 'react';
import { usePost } from '@amukhtar/hooks/usePost';
import { Post } from '@amukhtar/api/types';
import PostItem from '@amukhtar/components/PostItem';

import { SearchIcon } from '@assets/svg';
import BookMenuItem from '@amukhtar/components/List/BookMenuItem';
import { LogoImage, TawheedImage } from '@assets/Images';

import { useBooks } from '@amukhtar/hooks/useBook';
import SkeletonLoader from '@amukhtar/components/Loaders/SkeletonLoader';
import { useDispatch } from 'react-redux';
import { setBookId } from '@amukhtar/redux/slices/bookSlice';

export default function Home({ navigation }) {
  const { getAllBooks, loading, allBooks } = useBooks();
  useEffect(() => {
    getAllBooks();
  }, []);
  const dispatch = useDispatch();
  console.log('allBooks', allBooks);
  return (
    <SafeAreaView className="flex-1 bg-[#f9f9f9]">
      <StatusBar backgroundColor="#0361F0" />
      <View className="flex-row justify-between items-center bg-slate-800">
        <ImageBackground source={TawheedImage} style={{ height: '100%', width: '100%' }}>
          <Text className="text-2xl p-[20px] font-100 text-white"></Text>
        </ImageBackground>
      </View>
      <View className="flex-1 bg-white flex-row">
        <View className="w-[50px] bg-slate-800 ">
          <ImageBackground
            source={TawheedImage}
            style={{ height: '100%', width: '100%' }}
          ></ImageBackground>
        </View>
        <ScrollView className="flex-1 bg-white px-[5px]">
          {loading && <SkeletonLoader count={8} />}
          {!loading && (!allBooks || allBooks.length === 0) && (
            <View className="flex-1 justify-center items-center py-10">
              <Text className="text-xl text-gray-900">No books available</Text>
              <TouchableOpacity
                className="mt-4 bg-blue-900 py-2 px-4 rounded-lg"
                onPress={getAllBooks}
              >
                <Text className="text-white">Refresh</Text>
              </TouchableOpacity>
            </View>
          )}
          {allBooks
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((book) => (
              <BookMenuItem
                description={book.description}
                key={book.title}
                title={book.title}
                coverImage={book.coverImage}
                onPress={() => {
                  dispatch(setBookId(book.id));
                  navigation.navigate('BookDetails');
                }}
              />
            ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
