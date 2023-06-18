import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SearchWordListView = ({ searchWordItems, textInputRef }) => {
  const onSearchPress = useCallback(item => {
    textInputRef.current.setNativeProps({
      text: item,
    });
    textInputRef.current.value = item;
  }, []);

  return (
    <View style={styles.searchWord}>
      <Text style={styles.searchWordTitle}>최근검색어</Text>
      {searchWordItems.length === 0 && <Text style={styles.searchWordItem}>없음</Text>}
      {searchWordItems.map((item, index) => {
        return (
          <TouchableOpacity key={item + index} onPress={() => onSearchPress(item)}>
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
    maxHeight: '100%',
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: '6%',
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
