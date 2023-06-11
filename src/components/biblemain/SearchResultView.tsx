import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SearchResultView = ({ searchResultItems, moveToBibleChapter }) => {
  return (
    <View style={styles.searchResultView}>
      <FlatList
        style={styles.searchResultFlat}
        data={searchResultItems}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity style={styles.searchResultFlatItem} onPress={() => moveToBibleChapter(item)}>
              <View style={{ width: '90%' }}>
                <Text style={styles.searchResultFlatItemTitle}>
                  {item.bibleName}-{item.bookName} {item.chapterCode}장 {item.verseCode}절
                </Text>
                <Text style={styles.searchResultFlatItemContent}>{item.content}</Text>
              </View>
              <Image style={styles.searchResultFlatItemImage} source={require('../../assets/ic_arrow.png')} />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default SearchResultView;

const styles = StyleSheet.create({
  searchResultView: {
    height: '90%',
    marginTop: 10,
    paddingTop: 20,
    paddingBottom: 15,
  },

  searchResultFlat: {
    paddingLeft: 16,
    paddingRight: 16,
  },

  searchResultFlatItem: {
    borderWidth: 1,
    paddingTop: 16,
    paddingBottom: 16,
    marginBottom: 5,
    paddingLeft: 13,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  searchResultFlatItemTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },

  searchResultFlatItemContent: {},

  searchResultFlatItemImage: {
    resizeMode: 'contain',
    width: 10,
    height: 30,
    marginRight: 12,
  },
});
