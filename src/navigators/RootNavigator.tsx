import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screen/login/LoginScreen';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomNavigator';
import BookListScreen from '../screen/bible/BookListScreen';
import ChapterListScreen from '../screen/bible/ChapterListScreen';
import VerseListScreen from '../screen/bible/VerseListScreen';
import TodayQuizScreen from '../screen/quiz/TodayQuizScreen';
import TodayQuizCheckScreen from '../screen/quiz/TodayQuizCheckScreen';
import OptionMainScreen from '../screen/setting/OptionMainScreen';
import ProfileEditScreen from '../screen/setting/ProfileEditScreen';
import AppVersionScreen from '../screen/setting/AppVersionScreen';
import NoticeScreen from '../screen/setting/NoticeScreen';
import CopyrightScreen from '../screen/setting/CopyrightScreen';
import PrivacyScreenNavigator from '../screen/setting/privacyscreen/PrivacyScreenNavigator';
import RecentlyReadBibleListScreen from '../screen/bible/RecentlyReadBibleListScreen';

const Stack = createStackNavigator();

const Root = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" options={{ headerShown: false }} component={LoginScreen} />
        <Stack.Screen name="MainTabNavigator" options={{ headerShown: false }} component={BottomTabNavigator} />

        {/* 성경 화면 */}
        <Stack.Screen
          name="BookListScreen"
          options={({ route }) => ({
            headerTitle: route.params?.bibleType === 0 ? '구약성경' : '신약성경',
            headerBackTitle: '',
            headerTitleAlign: 'center',
            animationEnabled: false,
          })}
          component={BookListScreen}
        />
        <Stack.Screen
          name="ChapterListScreen"
          options={({ route }) => ({
            title: route.params?.bookName,
            headerTitleAlign: 'center',
            headerBackTitle: '',
          })}
          component={ChapterListScreen}
        />
        <Stack.Screen
          name="VerseListScreen"
          options={({ route }) => ({
            title: `${route.params?.bookName} ${route.params?.chapterCode}장`,
            headerTitleAlign: 'center',
            headerBackTitle: '',
          })}
          component={VerseListScreen}
        />
        <Stack.Screen name="RecentlyReadBibleListScreen" component={RecentlyReadBibleListScreen} />

        {/* 퀴즈 화면 */}
        <Stack.Screen name="TodayQuizScreen" options={{ headerShown: false, animationEnabled: false }} component={TodayQuizScreen} />
        <Stack.Screen
          name="TodayQuizCheckScreen"
          options={{ headerShown: false, animationEnabled: false }}
          component={TodayQuizCheckScreen}
        />

        {/* 옵션 화면 */}
        <Stack.Screen name="OptionMainScreen" options={{ headerShown: false }} component={OptionMainScreen} />
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
    </NavigationContainer>
  );
};

export default Root;
