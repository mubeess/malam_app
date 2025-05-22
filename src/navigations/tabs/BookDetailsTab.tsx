import React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, useColorScheme } from 'react-native';
import BookDetails from '@amukhtar/screens/main_app/BookDetails';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AudioIcon, VideoIcon } from '@assets/svg';
import VideoList from '@amukhtar/screens/main_app/VideoList';

const Tab = createMaterialTopTabNavigator();

function BookDetailsTab() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#1a1a1a' : '#ffffff'}
      />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode ? '#333333' : '#e0e0e0',
            paddingTop: Platform.OS == 'android' ? 20 : 0,
          },
          tabBarActiveTintColor: '#0361F0',
          tabBarInactiveTintColor: isDarkMode ? '#a0a0a0' : '#757575',
          tabBarIndicatorStyle: {
            backgroundColor: '#0361F0',
            height: 3,
          },
          tabBarLabelStyle: {
            textTransform: 'none',
            fontWeight: '600',
            fontSize: 16,
          },
        }}
      >
        <Tab.Screen
          name="Audio"
          component={BookDetails}
          options={{
            tabBarIcon: ({ color }) => <AudioIcon />,
          }}
        />
        <Tab.Screen
          name="Video"
          component={VideoList}
          options={{
            tabBarIcon: ({ color }) => <VideoIcon />,
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default BookDetailsTab;
