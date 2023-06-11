import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';

import { fetchDataFromSqlite } from '../../../utils';

const ChapterListScreen = props => {
  const [chapterItems, setChapterItems] = useState([]);
  const { route, navigation } = props;

  useEffect(() => {
    const { bookName, bookCode } = route.params;

    // 성경의 장을 모두 가져오는 쿼리를 수행.
    const initBibleChapterItem = async () => {
      const query = `SELECT max(chapter) as count FROM bible_korHRV where book = ${bookCode}`;
      const result = await fetchDataFromSqlite(query);
      const count = result.rows.item(0).count;
      const chapterItems = [];
      for (let i = 0; i < count; i++) {
        chapterItems.push({
          bookCode,
          bookName,
        });
      }

      setChapterItems(chapterItems);
    };

    initBibleChapterItem().then();
  }, [route.params]);

  const goToChapterListScreen = useCallback(
    bookInfo => {
      navigation.navigate('VerseListScreen', {
        bookName: bookInfo.bookName,
        bookCode: bookInfo.bookCode,
        chapterCode: bookInfo.chapterCode,
      });
    },
    [navigation],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>장을 선택해주세요.</Text>
      <FlatList
        style={styles.flatList}
        data={chapterItems}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item, index }) => {
          let chapterCode = index + 1;
          return (
            <TouchableOpacity
              style={styles.flatListItem}
              onPress={goToChapterListScreen.bind(this, {
                bookName: item.bookName,
                bookCode: item.bookCode,
                chapterCode: chapterCode,
              })}>
              <Text style={styles.flatListItemText}>
                {chapterCode}. {item.bookName} {chapterCode}장
              </Text>
              {/*<Text style={styles.flatListItemText}>1장</Text>*/}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default ChapterListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'white',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  flatList: {},
  flatListItem: {
    height: 57,
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    // paddingTop: 30,
    // paddingBottom: 30,
    paddingLeft: 2,
    paddingRight: 2,
    borderBottomColor: '#AABBCC',
    borderBottomWidth: 1,
  },
  flatListItemText: {
    color: 'black',
  },
});
