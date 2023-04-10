import React, { useCallback, useRef, useState } from 'react';
import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getItemFromAsync, setItemToAsync, uuidv4 } from '../../utils';

/**
 * Memo를 입력하는 Modal 창
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const MemoModal = ({ memoModalVisible, modalBibleItem, setMemoModalVisible, updateVerseItems, toastRef }) => {
  const [memoModalSaveButtonActive, setMemoModalSaveButtonActive] = useState(false);
  const { bookName, bookCode, chapterCode, verseCode, content } = modalBibleItem;
  let memo = useRef('');

  const onChangeText = useCallback(
    text => {
      if (text.length === 0) {
        setMemoModalSaveButtonActive(false);
      }
      // setState가 반복적으로 호출되는것을 막기 위해 memoModalSaveButtonActive 설정.
      else if (!memoModalSaveButtonActive && text.length >= 1) {
        setMemoModalSaveButtonActive(true);
      }
      memo = text;
    },
    [memoModalSaveButtonActive],
  );

  const onPressSaveButton = useCallback(async () => {
    let memoListItems = await getItemFromAsync('memoList');
    if (memoListItems === null) {
      memoListItems = [];
    }
    const objectId = uuidv4();
    const date = new Date();
    console.log(bookName, bookCode, chapterCode, verseCode, memo, date);
    memoListItems.push({
      objectId,
      bookName,
      bookCode,
      chapterCode,
      verseCode,
      memo,
      date,
      content,
    });
    await setItemToAsync('memoList', memoListItems);

    setMemoModalVisible(false);
    setMemoModalSaveButtonActive(false);

    updateVerseItems().then();
    toastRef.current.show('메모가 입력되었습니다.');
  }, [memoModalVisible, memoModalSaveButtonActive, modalBibleItem]);

  return (
    <Modal style={styles.modal} transparent={true} visible={memoModalVisible}>
      <View style={styles.memoModalContainer}>
        <View style={styles.memoModalView}>
          <View style={styles.memoModalHeader}>
            <TouchableOpacity style={styles.memoModalHeaderSave}>
              {memoModalSaveButtonActive ? (
                <Text style={styles.memoModalHeaderSaveTextActive} onPress={onPressSaveButton}>
                  저장
                </Text>
              ) : (
                <Text style={styles.memoModalHeaderSaveText}>저장</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.memoModalHeaderText}>메모</Text>
            <TouchableOpacity style={styles.memoModalHeaderCancel} onPress={() => setMemoModalVisible(false)}>
              <Image style={styles.memoModalHeaderCancelImage} source={require('../../assets/ic_close.png')} />
            </TouchableOpacity>
          </View>
          <View style={styles.memoModalBible}>
            <Text style={styles.memoModalBibleVerse}>
              {bookName} {chapterCode}장 {verseCode}절
            </Text>
            <Text style={styles.memoModalBibleContent}>{content}</Text>
          </View>
          <TextInput
            onChangeText={onChangeText.bind(this)}
            multiline={true}
            placeholder={'메모를 입력해주세요.'}
            style={styles.memoModalTextInput}
          />
        </View>
      </View>
    </Modal>
  );
};

export default MemoModal;

const styles = StyleSheet.create({
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
});
