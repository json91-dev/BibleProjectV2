// MainScreen에는 StackNavigator 추가한다.
// 성경책 스택을 위한 Navigator
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import BibleMainScreen from './BibleMainScreen';
import BookListScreen from './BookListScreen';
import ChapterListScreen from './ChapterListScreen';
import VerseListScreen from './VerseListScreen';

const Stack = createStackNavigator();
let stackIndex = 0;
let tabNavigation = null;

const BookListScreenOption = ({ route }) => ({
  headerTitle: route.params.bibleType === 0 ? '구약성경' : '신약성경',
  headerBackTitle: '',
  headerTitleAlign: 'center',
  animationEnabled: false,
});

// route에 BookListScreen, ChapterListScreen에 대한 정보를 담고 있음.
// 애니메이션이 끝난 후 tarBar을 보여주기 위한 기본 Screen 옵션 설정.
function DefaultScreenOption({ navigation }) {
  navigation.addListener('transitionEnd', () => {
    if (stackIndex === 0 && tabNavigation !== null) {
      tabNavigation.setOptions({ tabBarVisible: true });
    }
  });
}

const ChapterListScreenOption = ({ route }) => ({
  title: route.params.bookName,
  headerTitleAlign: 'center',
  headerBackTitle: '',
});
const VerseListScreenOption = ({ route }) => ({
  title: `${route.params.bookName} ${route.params.chapterCode}장`,
  headerTitleAlign: 'center',
  headerBackTitle: '',
});

const ContentListScreenOption = ({ route }) => ({
  title: `${route.params.bookName}`,
  headerTitleAlign: 'center',
});

function BibleScreenNavigator({ navigation, route }) {
  if (route.state) {
    stackIndex = route.state.index;
    tabNavigation = navigation;
  }
  /* 하단 탭바 출력 설정 */
  if (route.state && route.state.index > 0) {
    navigation.setOptions({ tabBarVisible: false });
  } else {
    navigation.setOptions({ tabBarVisible: true });
  }
  return (
    <Stack.Navigator screenOptions={DefaultScreenOption} initialRouteName="BibleMainScreen">
      <Stack.Screen name="BibleMainScreen" options={{ headerShown: false }} component={BibleMainScreen} />
      <Stack.Screen name="BookListScreen" options={BookListScreenOption} component={BookListScreen} />
      <Stack.Screen name="ChapterListScreen" options={ChapterListScreenOption} component={ChapterListScreen} />
      <Stack.Screen name="VerseListScreen" options={VerseListScreenOption} component={VerseListScreen} />
    </Stack.Navigator>
  );
}

export default BibleScreenNavigator;
