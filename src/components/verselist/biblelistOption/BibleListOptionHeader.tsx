import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { VERSE_LIST_PAGE } from './BibleListOption';

const BibleListOptionHeader = ({ pageStack, setPageStack, setHeaderTitle, headerTitle, closeModal }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={{ position: 'absolute', left: 5 }}
        onPress={() => {
          if (pageStack === VERSE_LIST_PAGE) {
            setHeaderTitle(headerTitle.substring(0, headerTitle.lastIndexOf(' ')));
          }

          setPageStack(pageStack - 1);
        }}>
        {pageStack !== 0 && (
          <View style={styles.headerLeftImageWrapper}>
            <Image style={styles.headerLeftImage} source={require('../../../assets/ic_left_arrow.png')} />
          </View>
        )}
      </TouchableOpacity>
      {pageStack === 0 ? <Text style={styles.headerText}>목차</Text> : <Text style={styles.headerText}>{headerTitle}</Text>}
      <TouchableOpacity style={{ position: 'absolute', right: 5 }} onPress={() => closeModal()}>
        <View style={styles.headerRightImageWrapper}>
          <Image style={styles.headerRightImage} source={require('../../../assets/ic_close.png')} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default BibleListOptionHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingTop: 13,
    paddingBottom: 13,
    paddingRight: 5,
    paddingLeft: 5,
    height: '15%',
  },

  headerLeftImageWrapper: {
    padding: 10,
  },

  headerLeftImage: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },

  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  headerRightImageWrapper: {
    padding: 5,
  },

  headerRightImage: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
});
