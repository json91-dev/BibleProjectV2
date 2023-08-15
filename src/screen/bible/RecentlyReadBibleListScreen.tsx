import { Dimensions, FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { RECENTLY_READ_BIBLE_LIST } from '../../constraints';
import { getItemFromAsyncStorage, getTimeAgo } from '../../utils';
import { StackActions, useIsFocused, useNavigation } from '@react-navigation/native';

export interface RecentlyReadBibleItem {
  bibleName: string; // ex) 구약
  bookName: string; // ex) 창세기
  bookCode: number; // ex) '1' (장)
  chapterCode: number; // ex) '1' (절)
  verseSentence: string;
  timestamp: number;
}

export interface RecentlyReadBibleList extends Array<RecentlyReadBibleItem> {}

const RecentlyReadBibleListScreen = () => {
  const [recentlyReadBibleList, setRecentlyReadBibleList] = useState<RecentlyReadBibleList>(null);
  const screenHeight = Dimensions.get('window').height;
  const flatListHeight = screenHeight - 50;
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  const getReadBibleListFromStorage = async () => {
    const bibleList = await getItemFromAsyncStorage<RecentlyReadBibleList | null>(RECENTLY_READ_BIBLE_LIST);

    if (bibleList) {
      setRecentlyReadBibleList(bibleList);
    }
  };

  const navigateRecentlyReadPage = useCallback(
    (bookCode, bookName, chapterCode) => {
      // const recentlyReadBibleItem: RecentlyReadBibleItem = recentlyReadBibleList[0];
      // const { bookCode, bookName, chapterCode } = recentlyReadBibleItem;

      // const bibleType = getBibleType(bookCode);
      // const pushBookList = StackActions.push('BookListScreen', {
      //   bibleType,
      // });
      // navigation.dispatch(pushBookList);
      //
      // const pushChapterList = StackActions.push('ChapterListScreen', {
      //   bookCode,
      //   bookName,
      // });
      // navigation.dispatch(pushChapterList);

      const pushVerseList = StackActions.push('VerseListScreen', {
        bookCode,
        bookName,
        chapterCode,
        isFromRecentlyReadPageButtonClick: true,
      });
      navigation.dispatch(pushVerseList);
    },
    [recentlyReadBibleList],
  );

  useEffect(() => {
    // setItemToAsyncStorage(RECENTLY_READ_BIBLE_LIST, []).then();
  }, []);

  const renderItem = ({ item }: { item: RecentlyReadBibleItem; index: number }) => {
    const { bookCode, bookName, chapterCode, verseSentence, timestamp } = item;

    return (
      <Pressable onPress={() => navigateRecentlyReadPage(bookCode, bookName, chapterCode)}>
        <View style={styles.bibleView}>
          <View style={styles.bibleViewLeft}>
            <Text style={styles.bibleTitleText}>
              {bookName} {chapterCode}장
            </Text>
            <Text style={styles.bibleVerseText}>{verseSentence}</Text>
            <Text style={styles.bibleDateText}>{timestamp && getTimeAgo(new Date(timestamp))}</Text>
          </View>

          <View style={styles.bibleViewRight}>
            <View style={styles.rightArrowImageView}>
              <Image style={styles.rightArrowImage} source={require('../../assets/ic_arrow_white.png')} />
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  useEffect(() => {
    getReadBibleListFromStorage().then();
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerView}>
        <View style={{ width: 60 }} />
        <Text style={styles.titleText}>최근 읽은 성경</Text>
        <TouchableOpacity style={styles.closeImageView} onPress={() => navigation.goBack()}>
          <Image style={styles.closeImage} source={require('../../assets/ic_close_white.png')} />
        </TouchableOpacity>
      </View>
      <FlatList style={[styles.flatList, { height: flatListHeight }]} data={recentlyReadBibleList} renderItem={renderItem} />
    </SafeAreaView>
  );
};

export default RecentlyReadBibleListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'black',
  },

  headerView: {
    width: '100%',
    height: 70,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#AAAAAA66',
  },

  closeImageView: {
    height: 60,
    width: 60,
    paddingTop: 20,
    paddingBottom: 20,
  },

  closeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  titleText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },

  flatList: {
    display: 'flex',
  },

  bibleView: {
    width: '100%',
    paddingTop: 13,
    paddingBottom: 13,
    paddingLeft: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#AAAAAA66',
    borderColor: 'white',
  },

  bibleTitleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },

  bibleVerseText: {
    color: 'white',
    marginBottom: 2,
  },

  bibleDateText: {
    color: 'white',
  },

  rightArrowImageView: {
    width: 35,
    height: 35,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  rightArrowImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },

  bibleViewLeft: {
    width: '91%',
  },

  bibleViewRight: {
    width: '9%',
  },
});
