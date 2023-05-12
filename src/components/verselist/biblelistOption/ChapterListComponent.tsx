import { Component, useEffect, useState } from 'react';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

/** 장 선택 컴포넌트 **/
const ChapterListComponent = ({ bookName, bookCode, changePageHandler }) => {
  const [chapterItems, setChapterItems] = useState([]);
  console.log(bookName, bookCode);

  useEffect(() => {
    // 성경의 장을 모두 가져오는 쿼리를 수행.
    let bibleDB = SQLite.openDatabase({ name: 'BibleDB.db', createFromLocation: 1 });
    bibleDB.transaction(tx => {
      const query = `SELECT max(chapter) as count FROM bible_korHRV where book = ${bookCode}`;
      tx.executeSql(query, [], (tx, results) => {
        let chapterItemsLength = results.rows.item(0).count;
        const chapterItems = [];
        for (let i = 0; i < chapterItemsLength; i++) {
          chapterItems.push({
            bookCode,
            bookName,
          });
        }
        setChapterItems(chapterItems);
      });
    });
  }, [bookName, bookCode]);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>장을 선택해주세요.</Text>
      <FlatList
        style={styles.flatList}
        data={chapterItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          let chapterCode = index + 1;
          return (
            <TouchableOpacity style={styles.flatListItem} onPress={changePageHandler(2, item.bookName, item.bookCode, chapterCode)}>
              <Text style={styles.flatListItemText}>
                {chapterCode}. {item.bookName}
                {chapterCode}장
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default ChapterListComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 17,
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
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 2,
    paddingRight: 2,
    borderBottomColor: '#AABBCC',
    borderBottomWidth: 1,
  },
  flatListItemText: {
    color: 'black',
  },
});
