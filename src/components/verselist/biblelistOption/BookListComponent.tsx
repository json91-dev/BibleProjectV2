import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { SectionGrid } from 'react-native-super-grid';

import { getOldBibleItems, getNewBibleItems } from '../../../utils';
const oldBibleItems = getOldBibleItems();
const newBibleItems = getNewBibleItems();
const activeItemColor = '#F9DA4F';

/** 목차 선택 컴포넌트 **/
const BookListComponent = ({ bibleType, changePage }) => {
  return (
    <View style={styles.container}>
      <SectionGrid
        itemDimension={84}
        staticDimension={480}
        sections={[
          {
            title: '목차를 선택해주세요',
            data: bibleType === 0 ? oldBibleItems : newBibleItems,
          },
        ]}
        style={styles.gridView}
        renderItem={({ item }) => (
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
        )}
        renderSectionHeader={({ section }) => <Text style={styles.titleText}>{section.title}</Text>}
      />
    </View>
  );
};

export default BookListComponent;

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
