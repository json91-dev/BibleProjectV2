import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const RecentlyReadBibleView = ({ navigateRecentlyReadPage, recentlyReadBibleItem }) => {
  const { bibleName, bookName, bookCode, chapterCode } = recentlyReadBibleItem;

  return (
    <View style={styles.recentlyReadBibleView}>
      <View style={styles.recentlyReadBibleViewInfo}>
        <Text style={styles.recentlyReadBibleViewInfoLabel}>최근 읽은 성서</Text>
        <Text style={styles.recentlyReadBibleViewInfoText}>
          {bibleName} - {bookName} {chapterCode}장
        </Text>
      </View>
      <TouchableOpacity onPress={() => navigateRecentlyReadPage(bookName, bookCode, chapterCode)}>
        <Text style={styles.recentlyReadBibleViewButton}>이어보기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RecentlyReadBibleView;

const styles = StyleSheet.create({
  recentlyReadBibleView: {
    position: 'absolute',
    width: '100%',
    height: '10%',
    bottom: 0,
    borderWidth: 1,
    backgroundColor: '#000000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '5%',
    paddingRight: '3%',
  },

  recentlyReadBibleViewInfo: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  recentlyReadBibleViewInfoLabel: {
    color: 'white',
    fontSize: 12,
  },

  recentlyReadBibleViewInfoText: {
    color: 'white',
  },

  recentlyReadBibleViewButton: {
    color: '#F9DA4F',
    paddingLeft: 10,
    paddingBottom: 10,
    paddingTop: 10,
    paddingRight: 10,
    borderWidth: 1,
  },
});
