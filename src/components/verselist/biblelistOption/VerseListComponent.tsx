import { Component } from 'react';
import React from 'react';
import SQLite from 'react-native-sqlite-storage';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// SQLITE 성공/실패 예외처리
const errorCallback = e => {
  console.log('DB connection fail');
};
const okCallback = result => {
  console.log('DB connection success');
};

export default class VerseListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verseItems: [],
    };
  }

  componentDidMount() {
    const { bookName, bookCode, chapterCode } = this.props;
    let bibleDB = SQLite.openDatabase({ name: 'BibleDB.db', createFromLocation: 1 }, okCallback, errorCallback);
    bibleDB.transaction(tx => {
      //성경의 절과 내용을 모두 가져오는 쿼리를 선언
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
        this.setState({ verseItems });
      });
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>절을 선택해주세요</Text>
        <FlatList
          style={styles.flatList}
          data={this.state.verseItems}
          keyExtractor={item => item.id}
          ref={ref => {
            this.flatListRef = ref;
          }}
          renderItem={({ item, index }) => {
            let verseCode = index + 1;
            return (
              <TouchableOpacity
                onPress={this.props.changeScreenHandler(item.bookName, item.bookCode, item.chapterCode, item.verseCode)}
                style={styles.flatListItem}>
                <Text style={styles.flatListItemTextLabel}> {verseCode}.</Text>
                <Text style={styles.flatListItemText}>{item.content}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }
}

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
