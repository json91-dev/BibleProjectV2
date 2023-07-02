import React from 'react';
import { FlatList, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import { getOldBibleItems, getNewBibleItems } from '../../../utils';
const oldBibleItems = getOldBibleItems();
const newBibleItems = getNewBibleItems();
const activeItemColor = '#F9DA4F';

/** 목차 선택 컴포넌트 **/
const BookListComponent = ({ bibleType, changePage }) => {
  const data = bibleType === 0 ? oldBibleItems : newBibleItems;

  return (
    <View style={styles.container}>
      <View style={styles.titleTextView}>
        <Text style={styles.titleText}>목차를 선택해주세요.</Text>
      </View>
      <FlatList
        data={data}
        numColumns={4}
        contentContainerStyle={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
        renderItem={({ item }) => {
          return (
            <TouchableHighlight
              style={[styles.itemContainer, { backgroundColor: '#F3F4F9' }]}
              activeOpacity={0.8}
              underlayColor={activeItemColor}
              onPress={changePage(1, item.bookName, item.bookCode)}>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCode}>{item.bookName}</Text>
              </View>
            </TouchableHighlight>
          );
        }}
      />
    </View>
  );
};

export default BookListComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  itemContainer: {
    justifyContent: 'center',
    borderRadius: 5,
    width: 70,
    aspectRatio: 1,
    borderWidth: 1,
    margin: 5,
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

  titleTextView: {
    width: '100%',
    display: 'flex',
    paddingLeft: 6,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft: 17,
    marginTop: 17,
  },
});
