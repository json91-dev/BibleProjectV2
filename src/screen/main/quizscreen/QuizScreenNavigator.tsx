import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import QuizMainScreen from './QuizMainScreen';
import TodayQuizScreen from './TodayQuizScreen';
import TodayQuizCheckScreen from './TodayQuizCheckScreen';

const Stack = createStackNavigator();

const MainScreenNavigator = ({ navigation, route }) => {
  if (route.state && route.state.index > 0) {
    navigation.setOptions({ tabBarVisible: false });
  } else {
    navigation.setOptions({ tabBarVisible: true });
  }

  return (
    <Stack.Navigator initialRouteName="QuizMainScreen">
      <Stack.Screen name="QuizMainScreen" options={{ headerShown: false }} component={QuizMainScreen} />
      <Stack.Screen name="TodayQuizScreen" options={{ headerShown: false, animationEnabled: false }} component={TodayQuizScreen} />
      <Stack.Screen
        name="TodayQuizCheckScreen"
        options={{ headerShown: false, animationEnabled: false }}
        component={TodayQuizCheckScreen}
      />
    </Stack.Navigator>
  );
};

export default MainScreenNavigator;
