import { StackActions } from '@react-navigation/native';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useCallback } from 'react';
import MemoIndicator from './MemoIndicator';
import HighlightText from './HighlightText';
import NextButton from './NextButton';
import PrevButton from './PrevButton';

const VerseFlatList = ({ navigation, verseItemList, verseItemFontSize, verseItemFontFamily, onLongPressButton }) => {
  /** 하단(이전,다음) 버튼에 대한 이벤트 처리 메서드 **/
  const moveChapter = useCallback((item, index) => {
    const popAction = StackActions.pop(1);
    navigation.dispatch(popAction);
    const pushChapterList = StackActions.push('VerseListScreen', {
      bookName: item.bookName,
      bookCode: item.bookCode,
      chapterCode: index,
    });
    navigation.dispatch(pushChapterList);
  }, []);

  const renderVerseItem = ({ item, index }) => {
    let verseCodeLabel = index + 1;
    const { chapterCode, maxChapterCode } = verseItemList[0];

    return (
      <>
        {index < verseItemList.length - 1 ? (
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? 'gray' : 'white',
              },
            ]}
            onLongPress={event => onLongPressButton(item, event)}>
            <View style={styles.flatListVerseItem}>
              <MemoIndicator item={item} verseItemFontSize={verseItemFontSize} />
              <Text style={[styles.flatListItemTextLabel, { fontSize: verseItemFontSize }]}>{verseCodeLabel}. </Text>
              <HighlightText item={item} verseItemFontSize={verseItemFontSize} verseItemFontFamily={verseItemFontFamily} />
            </View>
          </Pressable>
        ) : (
          <View style={styles.moveChapter}>
            {index >= verseItemList.length - 1 && chapterCode > 1 && (
              <PrevButton moveChapter={moveChapter} chapterCode={chapterCode} item={item} />
            )}

            {index >= verseItemList.length - 1 && chapterCode < maxChapterCode && (
              <NextButton moveChapter={moveChapter} chapterCode={chapterCode} item={item} maxChapterCode={maxChapterCode} />
            )}
          </View>
        )}
      </>
    );
  };

  return (
    <FlatList
      style={styles.flatList}
      contentContainerStyle={{ alignItems: 'center' }}
      data={verseItemList}
      keyExtractor={item => {
        return item.bookCode + item.chapterCode + item.verseCode;
      }}
      renderItem={renderVerseItem}
    />
  );
};

export default VerseFlatList;

const styles = StyleSheet.create({
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  flatList: {
    flexDirection: 'column',
    marginBottom: 10,
    marginTop: 10,
  },

  flatListVerseItem: {
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row',
  },

  flatListItemTextLabel: {
    width: '7%',
    textAlign: 'center',
  },

  flatListItemText: {
    width: '86%',
    color: 'black',
    marginRight: '3%',
    paddingRight: 5,
    marginLeft: 5,
  },

  flatListItemTextHighlight: {
    width: '86%',
    color: 'black',
    marginRight: '3%',
    paddingRight: 5,
    marginLeft: 5,
    textShadowColor: 'yellow',
    textShadowRadius: 15,
  },

  memoIndicator: {
    width: '4%',
    height: 19,
    resizeMode: 'contain',
    borderColor: 'red',
  },
  /* 모달 뷰 */
  modal: {
    borderWidth: 1,
    borderColor: 'red',
  },

  modalContainer: {
    // backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalView: {
    width: 250,
    height: 200,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
  },

  modalHeader: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10,
  },

  modalViewItems: {
    width: '90%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 25,
  },

  modalItemText: {
    color: 'black',
    fontSize: 15,
    textAlign: 'center',
  },

  modalItemImage: {
    width: 40,
    height: 30,
    resizeMode: 'contain',
  },

  modalCancel: {
    width: '100%',
    height: 50,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F4F4',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  copyButton: {
    paddingLeft: 11,
    paddingRight: 11,
    paddingTop: 9,
    paddingBottom: 7,
    borderRadius: 20,
  },

  highlightButton: {
    paddingLeft: 11,
    paddingRight: 11,
    paddingTop: 9,
    paddingBottom: 7,
    borderRadius: 20,
  },

  highlightButtonChecked: {
    backgroundColor: '#F9DA4F',
    paddingLeft: 11,
    paddingRight: 11,
    paddingTop: 9,
    paddingBottom: 7,
    borderRadius: 20,
  },

  memoButton: {
    paddingLeft: 11,
    paddingRight: 11,
    paddingTop: 9,
    paddingBottom: 7,
    borderRadius: 20,
  },

  memoButtonChecked: {
    backgroundColor: '#F9DA4F',
    paddingLeft: 11,
    paddingRight: 11,
    paddingTop: 9,
    paddingBottom: 7,
    borderRadius: 20,
  },

  /* 메모 모달 뷰 */

  memoModalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  memoModalView: {
    width: '80%',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
  },

  memoModalHeader: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },

  memoModalHeaderSave: {},

  memoModalHeaderSaveText: {
    fontSize: 16,
    color: '#E0E0E0',
  },

  memoModalHeaderSaveTextActive: {
    fontSize: 16,
    color: '#2F80ED',
  },

  memoModalHeaderText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginRight: 1,
  },

  memoModalHeaderCancel: {},

  memoModalHeaderCancelText: {
    fontSize: 20,
  },

  memoModalHeaderCancelImage: {
    width: 25,
    height: 25,
  },

  memoModalBible: {
    width: '100%',
    backgroundColor: '#F3F4F9',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'column',
  },

  memoModalBibleVerse: {
    marginTop: '5%',
    marginLeft: '5%',
    marginRight: '5%',
    fontWeight: 'bold',
  },

  memoModalBibleContent: {
    marginTop: '5%',
    marginLeft: '5%',
    marginRight: '5%',
    marginBottom: '5%',
  },

  memoModalTextInput: {
    width: '100%',
    height: 100,
    textAlignVertical: 'top',
    padding: '5%',
  },

  /* 푸터 옵션 */
  footerOptionContainer: {
    borderWidth: 1,
    position: 'absolute',
    left: '2.5%',
    bottom: '5%',
    width: '95%',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },

  footerOptionContainerItem: {
    width: '30%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerOptionIcon: {
    width: 40,
    height: 30,
    resizeMode: 'contain',
  },

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
