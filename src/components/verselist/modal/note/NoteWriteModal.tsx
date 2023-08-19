import React, { useCallback, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getItemFromAsyncStorage, setItemToAsyncStorage, uuidv4 } from '../../../../utils';
import { NOTE_LIST } from '../../../../constraints';
import { NoteList } from './NoteListModal';

/**
 * Memo를 입력하는 Modal 창
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const NoteWriteModal = ({ noteModalVisible, modalVerseItem, setNoteModalVisible, updateVerseItems, toastRef }) => {
  const [noteModalSaveButtonActive, setNoteModalSaveButtonActive] = useState(false);
  const { bookName, bookCode, chapterCode, verseCode, content } = modalVerseItem;
  let memo = useRef('');

  const onChangeText = useCallback(
    text => {
      if (text.length === 0) {
        setNoteModalSaveButtonActive(false);
      }
      // setState가 반복적으로 호출되는것을 막기 위해 noteModalSaveButtonActive 설정.
      else if (!noteModalSaveButtonActive && text.length >= 1) {
        setNoteModalSaveButtonActive(true);
      }
      memo = text;
    },
    [noteModalSaveButtonActive],
  );

  const onPressSaveButton = useCallback(async () => {
    let noteList = await getItemFromAsyncStorage<NoteList>(NOTE_LIST);
    if (noteList === null) {
      noteList = [];
    }

    const uuid = uuidv4();
    const date = new Date();
    noteList.push({
      uuid,
      bookName,
      bookCode,
      chapterCode,
      verseCode,
      memo,
      date,
      content,
    });
    await setItemToAsyncStorage(NOTE_LIST, noteList);

    setNoteModalVisible(false);
    setNoteModalSaveButtonActive(false);
    toastRef.current.show('메모가 입력되었습니다.');
    await updateVerseItems();
  }, [noteModalVisible, noteModalSaveButtonActive, modalVerseItem]);

  return (
    <>
      {noteModalVisible && (
        <View style={styles.noteModalContainer}>
          <View style={styles.noteModalView}>
            <View style={styles.noteModalHeader}>
              <TouchableOpacity style={styles.noteModalHeaderSave}>
                {noteModalSaveButtonActive ? (
                  <Text style={styles.noteModalHeaderSaveTextActive} onPress={onPressSaveButton}>
                    저장
                  </Text>
                ) : (
                  <Text style={styles.noteModalHeaderSaveText}>저장</Text>
                )}
              </TouchableOpacity>
              <Text style={styles.noteModalHeaderText}>메모</Text>
              <TouchableOpacity style={styles.noteModalHeaderCancel} onPress={() => setNoteModalVisible(false)}>
                <Image style={styles.noteModalHeaderCancelImage} source={require('../../../../assets/ic_close.png')} />
              </TouchableOpacity>
            </View>
            <View style={styles.noteModalBible}>
              <Text style={styles.noteModalBibleVerse}>
                {bookName} {chapterCode}장 {verseCode}절
              </Text>
              <Text style={styles.noteModalBibleContent}>{content}</Text>
            </View>
            <TextInput
              onChangeText={onChangeText.bind(this)}
              multiline={true}
              placeholder={'메모를 입력해주세요.'}
              style={styles.noteModalTextInput}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default NoteWriteModal;

const styles = StyleSheet.create({
  noteModalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 2000,
    paddingBottom: '10%',
  },

  noteModalView: {
    width: '80%',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
  },

  noteModalHeader: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },

  noteModalHeaderSave: {},

  noteModalHeaderSaveText: {
    fontSize: 16,
    color: '#E0E0E0',
  },

  noteModalHeaderSaveTextActive: {
    fontSize: 16,
    color: '#2F80ED',
  },

  noteModalHeaderText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginRight: 1,
  },

  noteModalHeaderCancel: {},

  noteModalHeaderCancelText: {
    fontSize: 20,
  },

  noteModalHeaderCancelImage: {
    width: 25,
    height: 25,
  },

  noteModalBible: {
    width: '100%',
    backgroundColor: '#F3F4F9',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'column',
  },

  noteModalBibleVerse: {
    marginTop: '5%',
    marginLeft: '5%',
    marginRight: '5%',
    fontWeight: 'bold',
  },

  noteModalBibleContent: {
    marginTop: '5%',
    marginLeft: '5%',
    marginRight: '5%',
    marginBottom: '5%',
  },

  noteModalTextInput: {
    width: '100%',
    height: 100,
    textAlignVertical: 'top',
    padding: '5%',
  },
});
