import React from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const SearchHeaderView = props => {
  const {
    searchHeaderViewTextFocus,
    searchHeaderViewTextBlur,
    searchHeaderViewTextOnChange,
    searchHeaderViewCancelPress,
    searchHeaderViewSearchPress,
    searchTextEditable,
    searchTextPlaceHolder,
    textInputRef,
  } = props;

  return (
    <View style={styles.searchView}>
      <TouchableOpacity
        style={styles.searchIcon}
        onPress={searchHeaderViewSearchPress}>
        <Image
          style={styles.searchIconImage}
          source={require('assets/ic_search.png')}
        />
      </TouchableOpacity>
      <View style={styles.searchViewInput}>
        <TextInput
          editable={searchTextEditable}
          style={styles.searchTextInput}
          placeholder={searchTextPlaceHolder}
          onFocus={searchHeaderViewTextFocus}
          onBlur={searchHeaderViewTextBlur}
          onChangeText={value => searchHeaderViewTextOnChange(value)}
          ref={textInputRef}></TextInput>
      </View>
      <TouchableOpacity
        style={styles.searchCancel}
        onPress={searchHeaderViewCancelPress}>
        <Image
          style={styles.searchCancelImage}
          source={require('assets/ic_close.png')}
        />
      </TouchableOpacity>

      <Image
        style={styles.searchViewBottom}
        source={require('assets/ic_search_bottom.png')}
      />
    </View>
  );
};

export default SearchHeaderView;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    height: '100%',
    justifyContent: 'center',
  },

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
