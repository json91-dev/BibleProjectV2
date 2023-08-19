import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image, TextInput } from 'react-native';

import { getItemFromAsyncStorage, setItemToAsyncStorage } from '../../../../utils';
import { getPassTimeText } from '../../../../utils';
import { NOTE_LIST } from '../../../../constraints';

export interface NoteItem {
  uuid: any;
  bookName: any;
  bookCode: any;
  chapterCode: any;
  verseCode: any;
  memo: any;
  date: any;
  content: any;
}

export interface NoteList extends Array<NoteItem> {}

const NoteListModal = ({ closeHandler, updateVerseItems, toastRef }) => {
  const [noteItems, setNoteItems] = useState([]);
  const [isNoteItemUpdate, setIsNoteItemUpdate] = useState(false);
  const [isOpenNoteEdit, setIsOpenNoteEdit] = useState(false);
  const [noteEditUuid, setNoteEditUuid] = useState(null);
  const [noteEditVerseText, setNoteEditVerseText] = useState(null);
  const [noteEditContent, setNoteEditContent] = useState(null);
  const [noteEditTextInput, setNoteEditTextInput] = useState('');

  const getBibleNotes = useCallback(async () => {
    let noteList = await getItemFromAsyncStorage<NoteList>(NOTE_LIST);

    if (noteList === null) {
      noteList = [];
    }

    let noteItems = [];
    noteList.forEach(noteItem => {
      let passTimeText = getPassTimeText(noteItem.date);
      noteItems.push({
        uuid: noteItem.uuid,
        bookName: noteItem.bookName,
        chapterCode: noteItem.chapterCode,
        verseCode: noteItem.verseCode,
        memo: noteItem.memo.toString(),
        content: noteItem.content,
        passTimeText: passTimeText,
      });
    });

    setNoteItems(noteItems.reverse());
    setIsNoteItemUpdate(true);
  }, [noteItems, isNoteItemUpdate]);

  useEffect(() => {
    getBibleNotes().then();
  }, []);

  /** 메모 수정 화면을 열어줌.*/
  // (1) 메모 수정화면에 전달할 값들을 setState를 통해 지정
  // (2) isOpenNoteEdit을 true로 만들어줌. (해당 값을 기준으로 화면 렌더링)
  const openNoteEdit = useCallback(
    (uuid, verseText, content, memo) => {
      setNoteEditUuid(uuid);
      setNoteEditVerseText(verseText);
      setNoteEditContent(content);
      console.log(memo);
      setNoteEditTextInput(memo);
      setIsOpenNoteEdit(true);
    },
    [noteEditUuid, noteEditVerseText, noteEditContent, isOpenNoteEdit],
  );

  /**
   * 메모 수정화면에서 백버튼이 눌렸을때 동작함.
   * 백버튼이 눌리면 메모 수정화면에서, 메모목록 화면으로 넘어감.
   * 이후 메모 목록에서 수정페이지에서 바뀐 텍스트가 있으면 해당 메모를 uuid로 조회후 수정후 반영.
   */
  const backToMemoList = useCallback(async () => {
    console.log('뒤로가기');
    let noteList = await getItemFromAsyncStorage<NoteList>(NOTE_LIST);

    if (noteList === null) noteList = [];

    const inputText = noteEditTextInput;

    let noteItems = [];

    // 바꿀 아이템 id 검색 후 수정
    const editItemIndex = noteList.findIndex(item => {
      return item.uuid === noteEditUuid;
    });

    // 아무런 입력이 없다면 해당 노트 삭제 => noteList 배열에서 삭제시킴
    // 입력이 있다면 해당 노트 수정.
    if (inputText.length < 1) {
      console.log('노트 삭제');
      noteList.splice(editItemIndex, 1);
      toastRef.current.show('노트가 삭제되었습니다 :)');
      updateVerseItems().then();
    } else {
      console.log('노트 수정');
      noteList[editItemIndex].memo = inputText;
      noteList[editItemIndex].date = new Date();
      toastRef.current.show('노트가 수정되었습니다. :)');
    }

    // 시간순서로 noteList 정렬
    // (시간에대한 내림차순으로 정렬됨) =>
    // 즉 나중에 수정된 아이가 유닉스 타임스탬프 시간이 크므로, 배열의 앞으로 들어가게 됨.
    // 따라서 방금 수정된 item => 나중에 수정된 item순으로 정렬된다.
    noteList.sort((a, b) => {
      const timestamp_a = new Date(a.date).getTime();
      const timestamp_b = new Date(b.date).getTime();
      return timestamp_a < timestamp_b ? -1 : timestamp_a > timestamp_b ? 1 : 0;
    });

    // 현재 아이템들에 대해서, 경과한 시간들을 계산한 뒤, noteItems로 push한다.
    // noteItems는 바뀐 noteList의 값을 state로 전달하는 기능 수행
    noteList.forEach(noteItem => {
      let passTimeText = getPassTimeText(noteItem.date);
      noteItems.push({
        uuid: noteItem.uuid,
        bookName: noteItem.bookName,
        chapterCode: noteItem.chapterCode,
        verseCode: noteItem.verseCode,
        memo: noteItem.memo,
        content: noteItem.content,
        passTimeText: passTimeText,
      });
    });

    // 아이템 갱신, 페이지 이동
    await setItemToAsyncStorage(NOTE_LIST, noteList);
    setIsOpenNoteEdit(false);
    setNoteItems(noteItems);
  }, [isOpenNoteEdit, noteItems, noteEditTextInput]);

  const closeMemoComponent = useCallback(async () => {
    console.log('취소버튼 누르기');
    if (isOpenNoteEdit) {
      let noteList = await getItemFromAsyncStorage<NoteList>(NOTE_LIST);
      if (noteList === null) {
        noteList = [];
      }

      const inputText = noteEditTextInput;
      const editItemIndex = noteList.findIndex(item => {
        return item.uuid === noteEditUuid;
      });

      // 아무런 입력이 없다면 해당 노트 삭제
      // 입력이 있다면 해당 노트 수정.
      if (inputText.length < 1) {
        noteList.splice(editItemIndex, 1);
        toastRef.current.show('노트가 삭제되었습니다 :)');
        updateVerseItems().then();
      } else {
        noteList[editItemIndex].memo = inputText;
        noteList[editItemIndex].date = new Date();

        // 시간순서로 noteList 정렬
        // (시간에대한 내림차순으로 정렬됨) =>
        // 즉 나중에 수정된 아이가 유닉스 타임스탬프 시간이 크므로, 배열의 앞으로 들어가게 됨.
        // 따라서 방금 수정된 item => 나중에 수정된 item순으로 정렬된다.
        noteList.sort((a, b) => {
          const timestamp_a = new Date(a.date).getTime();
          const timestamp_b = new Date(b.date).getTime();
          return timestamp_a < timestamp_b ? -1 : timestamp_a > timestamp_b ? 1 : 0;
        });

        toastRef.current.show('노트가 수정되었습니다 :)');
      }

      // 바뀐 정보를 저장한뒤 부모의 closeHandler호출
      setItemToAsyncStorage(NOTE_LIST, noteList).then(() => {
        closeHandler();
      });
    } else {
      closeHandler();
    }
  }, [noteEditTextInput, noteEditUuid]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={{ position: 'absolute', left: 5 }} onPress={backToMemoList}>
          {isOpenNoteEdit ? (
            <View style={styles.headerLeftImageWrapper}>
              <Image style={styles.headerLeftImage} source={require('../../../../assets/ic_left_arrow.png')} />
            </View>
          ) : null}
        </TouchableOpacity>
        <Text style={styles.headerText}>성경노트</Text>
        <TouchableOpacity style={{ position: 'absolute', right: 5 }} onPress={closeMemoComponent}>
          <View style={styles.headerRightImageWrapper}>
            <Image style={styles.headerRightImage} source={require('../../../../assets/ic_close.png')} />
          </View>
        </TouchableOpacity>
      </View>

      {noteItems.length === 0 && isNoteItemUpdate && (
        <View style={styles.noteNone}>
          <Image style={styles.noteNoneImage} source={require('../../../../assets/ic_note.png')} />
          <Text style={styles.noteNoneText}>메모한 흔적이 없어요.{'\n'}너무 소홀하셨던거 아닐까요?</Text>
        </View>
      )}

      {!isOpenNoteEdit && (
        <FlatList
          data={noteItems}
          keyExtractor={(item, index) => item.toString() + index.toString() + item.content}
          renderItem={({ item, index }) => {
            const { uuid, bookName, chapterCode, verseCode, content, memo, passTimeText } = item;
            const verseText = `${bookName} ${chapterCode}장 ${verseCode}절`;
            return (
              <View>
                <TouchableOpacity onPress={() => openNoteEdit(uuid, verseText, content, memo)}>
                  <View style={styles.noteItemView}>
                    <Text style={styles.noteItemIndex}>{index + 1}.</Text>
                    <View style={styles.noteItemInnerView}>
                      <Text style={styles.noteItemVerseText}>{verseText}</Text>
                      <Text style={styles.noteItemMemo}>{memo.toString()}</Text>
                      <Text style={styles.noteItemDate}>{passTimeText}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      {isOpenNoteEdit && (
        <View style={styles.noteEdit}>
          <View style={styles.noteEditHeader}>
            <Text style={styles.noteEditVerseText}>{noteEditVerseText}</Text>
            <Text style={styles.noteEditContent}>{noteEditContent}</Text>
          </View>
          <TextInput
            placeholder={'내용이 없으면 노트가 삭제됩니다.'}
            style={styles.noteEditTextInput}
            onChangeText={text => setNoteEditTextInput(text)}
            value={noteEditTextInput}
          />
        </View>
      )}
    </View>
  );
};

export default NoteListModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    width: '95%',
    height: '75%',
    top: 30,
    borderRadius: 5,
    backgroundColor: 'white',
    left: '2.5%',
    borderWidth: 1,
  },

  header: {
    flexDirection: 'row',
    width: '100%',
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
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },

  headerText: {
    marginTop: 4,
    fontSize: 18,
    marginLeft: 5,
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

  noteNone: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    width: '100%',
    height: '85%',
  },

  noteNoneImage: {
    width: 70,
    height: 80,
    resizeMode: 'contain',
  },

  noteNoneText: {
    marginTop: 28,
    color: '#BDBDBD',
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
  },

  noteItemView: {
    marginLeft: 14,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderColor: '#AEAEAE',
    flexDirection: 'row',
  },

  noteItemIndex: {
    fontWeight: 'bold',
  },

  noteItemInnerView: {
    marginLeft: 14,
    marginTop: 3,
    marginRight: 16,
  },

  noteItemVerseText: {
    fontSize: 12,
    color: '#828282',
  },

  noteItemMemo: {
    fontWeight: 'bold',
    marginTop: 7,
  },

  noteItemDate: {
    fontSize: 12,
    color: '#828282',
    marginTop: 7,
  },

  noteEditHeader: {
    paddingTop: 30,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 40,
    borderBottomWidth: 1,
    borderColor: '#AEAEAE',
  },

  noteEditVerseText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  noteEditContent: {
    marginTop: 11,
  },

  noteEditTextInput: {
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    width: '100%',
  },

  noteEdit: {},
});
