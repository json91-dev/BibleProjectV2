import { Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { RECENTLY_READ_BIBLE_LIST } from '../../constraints';
import { getItemFromAsyncStorage } from '../../utils';

export interface RecentlyReadBibleItem {
  bibleName: string; // ex) 구약
  bookName: string; // ex) 창세기
  bookCode: number;
  chapterCode: number;
  verseSentence: string;
}

export interface RecentlyReadBibleList extends Array<RecentlyReadBibleItem> {}

const RecentlyReadBibleListScreen = () => {
  const [recentlyReadBibleList, setRecentlyReadBibleList] = useState<RecentlyReadBibleList>(null);
  const screenHeight = Dimensions.get('window').height;
  const flatListHeight = screenHeight - 50;

  const getReadBibleListFromStorage = async () => {
    const bibleList = await getItemFromAsyncStorage<RecentlyReadBibleList | null>(RECENTLY_READ_BIBLE_LIST);
    if (bibleList) {
      setRecentlyReadBibleList(bibleList);
    }
  };

  const renderItem = ({ item, index }: { item: recentlyReadBibleItem; index: number }) => {
    return (
      <View style={styles.bibleView}>
        <Text style={styles.bibleTitleText}>누가복음 {1}장</Text>
        <Text style={styles.bibleVerseText}>성범그리스도가 명하느니 세계여 재창 각?</Text>
        <Text style={styles.bibleDateText}>1일전</Text>
      </View>
    );
  };

  useEffect(() => {
    getReadBibleListFromStorage().then();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerView}>
        <View style={{ width: 20 }} />
        <Text style={styles.titleText}>최근 읽은 성경</Text>
        <TouchableOpacity style={{ padding: 3 }}>
          <Image style={styles.closeImage} source={require('../../assets/ic_close_white.png')} />
        </TouchableOpacity>
      </View>
      <FlatList style={[styles.flatList, { height: flatListHeight }]} data={[1, 2, 3]} renderItem={renderItem} />
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
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#AAAAAA88',
  },

  titleText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },

  closeImage: {
    width: 20,
    height: 20,
    resizeMode: 'cover',
  },

  flatList: {
    borderWidth: 1,
    borderColor: 'white',
  },

  bibleView: {
    height: 100,
    width: '100%',
  },

  bibleTitleText: {
    color: 'white',
  },

  bibleVerseText: {
    color: 'white',
  },

  bibleDateText: {
    color: 'white',
  },
});
