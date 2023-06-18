import React from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

const SearchHeaderView = ({ textInputFocus, searchCancelPress, searchPress, textInputPlaceHolder, textInputRef }) => {
  return (
    <View style={styles.searchView}>
      <TouchableOpacity style={styles.searchIcon} onPress={searchPress}>
        <Image style={styles.searchIconImage} source={require('../../assets/ic_search.png')} />
      </TouchableOpacity>
      <View style={styles.searchViewInput}>
        <TextInput
          style={styles.searchTextInput}
          placeholder={textInputPlaceHolder}
          onFocus={textInputFocus}
          ref={textInputRef}
          onChangeText={text => {
            textInputRef.current.value = text;
          }}
        />
      </View>
      <TouchableOpacity style={styles.searchCancel} onPress={searchCancelPress}>
        <Image style={styles.searchCancelImage} source={require('../../assets/ic_close.png')} />
      </TouchableOpacity>

      <Image style={styles.searchViewBottom} source={require('../../assets/ic_search_bottom.png')} />
    </View>
  );
};

export default React.memo(SearchHeaderView);

const styles = StyleSheet.create({
  searchViewInput: {
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  searchTextInput: {
    borderColor: 'red',
    height: '100%',
    width: '100%',
  },

  searchView: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: 60,
    position: 'absolute',
    top: 0,
  },

  searchIcon: {
    width: '15%',
    height: '100%',
    position: 'absolute',
    left: 1,
  },
  searchIconImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },

  searchCancel: {
    width: '15%',
    height: '100%',
    position: 'absolute',
    right: 1,
  },

  searchCancelImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },

  searchViewBottom: {
    width: '80%',
    height: 10,
    position: 'absolute',
    top: 52,
    left: 0,
  },
});
