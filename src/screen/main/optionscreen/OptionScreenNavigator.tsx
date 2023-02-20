// MainScreen에는 StackNavigator 추가한다.
// 성경책 스택을 위한 Navigator
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import OptionMainScreen from './OptionMainScreen';
import ProfileEditScreen from './ProfileEditScreen';
import AppVersionScreen from './AppVersionScreen';
import NoticeScreen from './NoticeScreen';
import CopyrightScreen from './CopyrightScreen';
import PrivacyScreenNavigator from './privacyscreen/PrivacyScreenNavigator';
const Stack = createStackNavigator();

function MainScreenNavigator() {
  return (
    <Stack.Navigator initialRouteName="OptionMainScreen">
      <Stack.Screen
        name="OptionMainScreen"
        options={{headerShown: false}}
        component={OptionMainScreen}
      />
      <Stack.Screen
        name="ProfileEditScreen"
        options={{
          title: '프로필 수정',
          headerTitleAlign: 'center',
          headerBackTitle: '',
        }}
        component={ProfileEditScreen}
      />
      <Stack.Screen
        name="AppVersionScreen"
        options={{
          title: '앱 버전',
          headerTitleAlign: 'center',
          headerBackTitle: '',
        }}
        component={AppVersionScreen}
      />
      <Stack.Screen
        name="NoticeScreen"
        options={{
          title: '공지사항',
          headerTitleAlign: 'center',
          headerBackTitle: '',
        }}
        component={NoticeScreen}
      />
      <Stack.Screen
        name="CopyrightScreen"
        options={{
          title: '저작권',
          headerTitleAlign: 'center',
          headerBackTitle: '',
        }}
        component={CopyrightScreen}
      />
      <Stack.Screen name="PrivacyScreen" component={PrivacyScreenNavigator} />
    </Stack.Navigator>
  );
}

export default MainScreenNavigator;
