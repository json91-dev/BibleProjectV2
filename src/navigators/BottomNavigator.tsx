import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import QuizMainScreen from '../screen/quiz/QuizMainScreen';
import BibleMainScreen from '../screen/bible/BibleMainScreen';
import OptionMainScreen from '../screen/setting/OptionMainScreen';

const Tab = createBottomTabNavigator();

/**
 * Navigation 이름과 Focus 옵션에 따른 이미지 Path를 가져옴.
 * 이미지이름이나 Navigation 이름이 변경될경우 꼭 같이 수정해야 함.
 * @param navName
 * @param focused
 */

const setBottomIconImagePath = (navName, focused) => {
  const key = navName + (focused ? 'Focus' : '');

  const imagePath = {
    MainScreen: require('../assets/ic_heart_off.png'),
    MainScreenFocus: require('../assets/ic_heart_off.png'),
    BibleScreen: require('../assets/ic_thecross_off.png'),
    BibleScreenFocus: require('../assets/ic_thecross_on.png'),
    QuizScreen: require('../assets/ic_question_off.png'),
    QuizScreenFocus: require('../assets/ic_question_on.png'),
    OptionScreen: require('../assets/ic_option_off.png'),
    OptionScreenFocus: require('../assets/ic_option_on.png'),
  };

  return imagePath[key];
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Main"
      screenOptions={({ route }) => ({
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 2,
          marginBottom: 4,
        },
        tabBarIcon: ({ focused }) => {
          const iconPath = setBottomIconImagePath(route.name, focused);
          // You can return any component that you like here!
          return <Image style={{ width: 27, height: 27 }} source={iconPath} />;
        },
      })}>
      <Tab.Screen
        name="BibleScreen"
        component={BibleMainScreen}
        options={() => {
          return {
            tabBarLabel: '성경',
            headerShown: false,
            tabBarVisible: false,
          };
        }}
      />
      <Tab.Screen
        name="QuizScreen"
        component={QuizMainScreen}
        options={() => {
          return {
            tabBarLabel: '세례문답',
            headerShown: false,
          };
        }}
      />
      <Tab.Screen
        name="OptionScreen"
        component={OptionMainScreen}
        options={() => {
          return {
            tabBarLabel: '더보기',
            headerShown: false,
          };
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
