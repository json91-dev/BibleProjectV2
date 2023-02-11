import {Component} from 'react';
import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {FlatGrid, SectionGrid} from 'react-native-super-grid';

import {getOldBibleItems, getNewBibleItems} from '/utils';

export default class BookListComponent extends Component {
  render() {
    const oldBibleItems = getOldBibleItems();
    const newBibleItems = getNewBibleItems();

    const item = this.props.bibleType === 0 ? oldBibleItems : newBibleItems;
    const activeItemColor = '#F9DA4F';
    return (
      <View style={styles.container}>
        {/*추후 static Dimension이 문제를 발생시킬수 있기 떄문에 확인 필요함.*/}
        <SectionGrid
          itemDimension={84}
          staticDimension={480}
          sections={[
            {
              title: '목차를 선택해주세요',
              data: item,
            },
          ]}
          style={styles.gridView}
          renderItem={({item, index}) => (
            <TouchableHighlight
              style={[styles.itemContainer, {backgroundColor: '#F3F4F9'}]}
              activeOpacity={0.8}
              underlayColor={activeItemColor}
              // sqlite조회를 위한 bookId를 넘겨줍니다.
              //onPress={() => this.props.navigation.navigate('ChapterListScreen',{bookName: item.bookName, bookCode: item.bookCode})}
              onPress={this.props.changePageHandler(
                1,
                item.bookName,
                item.bookCode,
              )}>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCode}>{item.bookName}</Text>
              </View>
            </TouchableHighlight>
          )}
          renderSectionHeader={({section}) => (
            <Text style={styles.titleText}>{section.title}</Text>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  gridView: {
    backgroundColor: 'white',
  },

  itemContainer: {
    justifyContent: 'center',
    borderRadius: 5,
    width: 70,
    aspectRatio: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  itemName: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: 'black',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 5,
  },

  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft: 17,
    marginTop: 17,
  },
});
