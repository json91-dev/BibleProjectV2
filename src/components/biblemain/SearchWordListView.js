import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const SearchWordListView = () => {
  return (
    <View style={styles.searchWord}>
      <Text style={styles.searchWordTitle}>최근검색어</Text>
      {searchWordItemsReverse.map((item, index) => {
        return (
          <TouchableOpacity key={item + index} onPress={onSearchPress(item)}>
            <Text style={styles.searchWordItem}>{item}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default SearchWordListView;

const styles = StyleSheet.create({
  searchWord: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: '3%',
  },

  searchWordTitle: {
    marginBottom: '5%',
    color: '#BDBDBD',
  },

  searchWordItem: {
    color: 'black',
    fontSize: 24,
    marginBottom: '2%',
    fontWeight: 'bold',
  },
});
