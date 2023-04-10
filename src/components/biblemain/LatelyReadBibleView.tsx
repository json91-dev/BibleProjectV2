import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LatelyReadBibleView = props => {
  const { goToLatestReadScreen, latelyReadItem } = props;
  const { bibleName, bookName, bookCode, chapterCode } = latelyReadItem;

  return (
    <View style={styles.latelyReadBibleView}>
      <View style={styles.latelyReadBibleViewInfo}>
        <Text style={styles.latelyReadBibleViewInfoLabel}>최근 읽은 성서</Text>
        <Text style={styles.latelyReadBibleViewInfoText}>
          {bibleName} - {bookName} {chapterCode}장
        </Text>
      </View>
      <TouchableOpacity onPress={() => goToLatestReadScreen(bookName, bookCode, chapterCode)}>
        <Text style={styles.latelyReadBibleViewButton}>이어보기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LatelyReadBibleView;

const styles = StyleSheet.create({
  latelyReadBibleView: {
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

  latelyReadBibleViewInfo: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  latelyReadBibleViewInfoLabel: {
    color: 'white',
    fontSize: 12,
  },

  latelyReadBibleViewInfoText: {
    color: 'white',
  },

  latelyReadBibleViewButton: {
    color: '#F9DA4F',
    paddingLeft: 10,
    paddingBottom: 10,
    paddingTop: 10,
    paddingRight: 10,
    borderWidth: 1,
  },
});
