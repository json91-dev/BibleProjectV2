import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import { getBibleType } from '../../utils';
import { RecentlyReadBibleItem } from '../../screen/bible/RecentlyReadBibleListScreen';

const RecentlyReadBibleView = ({
  setIsShowRecentlyReadBibleView,
  recentlyReadBibleItem,
}: {
  setIsShowRecentlyReadBibleView: Function;
  recentlyReadBibleItem: RecentlyReadBibleItem;
}) => {
  const { bibleName, bookName, bookCode, chapterCode } = recentlyReadBibleItem;
  const navigation = useNavigation<any>();

  // 최근 읽은 성경 가기 Link
  const navigateRecentlyReadPage = useCallback(() => {
    const bibleType = getBibleType(bookCode);
    const pushBookList = StackActions.push('BookListScreen', {
      bibleType,
    });
    navigation.dispatch(pushBookList);

    const pushChapterList = StackActions.push('ChapterListScreen', {
      bookCode,
      bookName,
    });
    navigation.dispatch(pushChapterList);

    const pushVerseList = StackActions.push('VerseListScreen', {
      bookCode,
      bookName,
      chapterCode,
      isFromRecentlyReadPageButtonClick: true,
    });
    navigation.dispatch(pushVerseList);

    // setIsShowRecentlyReadBibleView(false);
  }, [recentlyReadBibleItem]);

  const navigateRecentlyReadBookListPage = useCallback(() => {
    navigation.navigate('RecentlyReadBibleListScreen', {});
  }, []);

  return (
    <Pressable style={styles.containerTouch} onPress={navigateRecentlyReadBookListPage}>
      <View style={styles.recentlyReadBibleView}>
        <View style={styles.recentlyReadBibleViewInfo}>
          <Text style={styles.recentlyReadBibleViewInfoLabel}>최근 읽은 성서</Text>
          <Text style={styles.recentlyReadBibleViewInfoText}>
            {bibleName} - {bookName} {chapterCode}장
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigateRecentlyReadPage()}>
          <Text style={styles.recentlyReadBibleViewButton}>이어보기</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export default RecentlyReadBibleView;

const styles = StyleSheet.create({
  containerTouch: {
    position: 'absolute',
    width: '100%',
    height: '10%',
    bottom: 0,
    borderWidth: 1,
  },

  recentlyReadBibleView: {
    width: '100%',
    height: '100%',
    borderColor: 'white',
    backgroundColor: '#000000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '5%',
    paddingRight: '3%',
  },

  recentlyReadBibleViewInfo: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  recentlyReadBibleViewInfoLabel: {
    color: 'white',
    fontSize: 12,
  },

  recentlyReadBibleViewInfoText: {
    color: 'white',
  },

  recentlyReadBibleViewButton: {
    color: '#F9DA4F',
    paddingLeft: 10,
    paddingBottom: 10,
    paddingTop: 10,
    paddingRight: 10,
    borderWidth: 1,
  },
});
