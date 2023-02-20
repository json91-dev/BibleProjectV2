import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

/** 첫번째 장일경우에는 다음장 보기 버튼만 출력 **/
const PrevButton = ({moveChapter, chapterCode, item}) => {
  if (chapterCode > 1) {
    return (
      <TouchableOpacity
        style={styles.moveChapterBtn}
        onPress={() => moveChapter(item, item.chapterCode - 1)}>
        <Text style={styles.moveChapterText}>이전장 보기</Text>
      </TouchableOpacity>
    );
  } else {
    return null;
  }
};

export default PrevButton;

const styles = StyleSheet.create({
  /* 성경 버튼 이동 */
  moveChapter: {
    paddingBottom: 100,
    marginTop: 20,
    width: '90%',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  moveChapterBtn: {
    width: 130,
    height: 60,
    backgroundColor: '#F9DA4F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },

  moveChapterText: {
    fontWeight: 'bold',
  },
});
