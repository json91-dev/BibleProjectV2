import { useEffect, useState } from 'react';
import React from 'react';
import SQLite from 'react-native-sqlite-storage';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const VerseListComponent = ({ bookName, bookCode, chapterCode, changeScreenHandler }) => {
  const [verseItems, setVerseItems] = useState([]);

  useEffect(() => {
    let bibleDB = SQLite.openDatabase({ name: 'BibleDB.db', createFromLocation: 1 });
    bibleDB.transaction(tx => {
      const query = `SELECT verse, content FROM bible_korHRV where book = ${bookCode} and chapter = ${chapterCode}`;
      tx.executeSql(query, [], (tx, results) => {
        let verseItemsLength = results.rows.length;
        const verseItems = [];
        for (let i = 0; i < verseItemsLength; i++) {
          const content = results.rows.item(i).content;
          const verseCode = results.rows.item(i).verse;
          verseItems.push({
            bookName,
            bookCode,
            chapterCode,
            content,
            verseCode,
          });
        }
        setVerseItems(verseItems);
      });
    });
  }, [bookName, bookCode, chapterCode]);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>절을 선택해주세요</Text>
      <FlatList
        data={verseItems}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => {
          let verseCode = index + 1;
          return (
            <TouchableOpacity
              onPress={changeScreenHandler(item.bookName, item.bookCode, item.chapterCode, item.verseCode)}
              style={styles.flatListItem}>
              <Text style={styles.flatListItemTextLabel}> {verseCode}.</Text>
              <Text style={styles.flatListItemText}>{item.content}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default VerseListComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: 'white',
  },

  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft: 15,
  },

  flatListItem: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 2,
    paddingRight: 2,
    flexDirection: 'row',
  },

  flatListItemTextLabel: {
    marginLeft: '2%',
    width: '6%',
  },

  flatListItemText: {
    width: '88%',
    color: 'black',
  },

  flatListItemTextHighlight: {
    width: '88%',
    color: 'black',
    textShadowColor: 'yellow',
    textShadowRadius: 15,
  },
});
