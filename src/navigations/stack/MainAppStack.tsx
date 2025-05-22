import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { stackScreenOptions } from '@amukhtar/constants';
import { RootStackParamList } from '../types';
import Home from '@amukhtar/screens/main_app/Home';
import BookDetails from '@amukhtar/screens/main_app/BookDetails';
import BookDetailsTab from '../tabs/BookDetailsTab';

const Stack = createStackNavigator<RootStackParamList>();

function MainAppStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="BookDetails" component={BookDetailsTab} />
    </Stack.Navigator>
  );
}

export default MainAppStack;
