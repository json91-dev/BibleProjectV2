import {Component} from 'react';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

// SQLITE 성공/실패 예외처리
const errorCallback = e => {
  console.log('DB connection fail');
  // console.log(e.message);
};
const okCallback = result => {
  console.log('DB connection success');
  // console.log(result);
};

export default class ChapterListComponent extends Component {
  state = {
    chapterItems: [],
  };

  componentDidMount() {
    const {bookName, bookCode} = this.props;
    // 성경의 장을 모두 가져오는 쿼리를 수행.
    let bibleDB = SQLite.openDatabase(
      {name: 'BibleDB.db', createFromLocation: 1},
      okCallback,
      errorCallback,
    );
    bibleDB.transaction(tx => {
      const query = `SELECT max(chapter) as count FROM bible_korHRV where book = ${bookCode}`;
      tx.executeSql(query, [], (tx, results) => {
        let chapterItemsLength = results.rows.item(0).count;
        const chapterItems = [];
        /**
         * Item insert
         */
        for (let i = 0; i < chapterItemsLength; i++) {
          chapterItems.push({
            bookCode,
            bookName,
          });
        }
        this.setState({chapterItems});
      });
    });
  }

  // onPress={this.goToChapterListScreen.bind(this,
  //   {
  //     bookName: item.bookName,
  //     bookCode: item.bookCode,
  //     chapterCode: chapterCode,
  //   })}>

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>장을 선택해주세요.</Text>
        <FlatList
          style={styles.flatList}
          data={this.state.chapterItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            let chapterCode = index + 1;
            return (
              <TouchableOpacity
                style={styles.flatListItem}
                onPress={this.props.changePageHandler(
                  2,
                  item.bookName,
                  item.bookCode,
                  chapterCode,
                )}>
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
  }
}

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
