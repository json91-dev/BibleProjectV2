import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image, TextInput } from 'react-native';

import { getItemFromAsync, setItemToAsync } from '../../utils';
import Toast from 'react-native-easy-toast';
import { getPassTimeText } from '../../utils';

const BibleNoteOption = ({ closeHandler, updateVerseItems }) => {
  const [noteItems, setNoteItems] = useState([]);
  const [isNoteItemUpdate, setIsNoteItemUpdate] = useState(false);
  const [isOpenMemoEdit, setIsOpenMemoEdit] = useState(false);
  const [memoEditObjectId, setMemoEditObjectId] = useState(null);
  const [memoEditVerseText, setMemoEditVerseText] = useState(null);
  const [memoEditContent, setMemoEditContent] = useState(null);
  const [memoEditMemo, setMemoEditMemo] = useState(null);
  const [memoEditTextInput, setMemoEditTextInput] = useState('');
  const toastRef = useRef(null);

  const getBibleNotes = useCallback(async () => {
    let memoList = await getItemFromAsync<any[]>('memoList');

    if (memoList === null) {
      memoList = [];
    }

    let noteItems = [];
    memoList.forEach(memoItem => {
      let passTimeText = getPassTimeText(memoItem.date);
      noteItems.push({
        objectId: memoItem.objectId,
        bookName: memoItem.bookName,
        chapterCode: memoItem.chapterCode,
        verseCode: memoItem.verseCode,
        memo: memoItem.memo.toString(),
        content: memoItem.content,
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
  // (2) isOpenMemoEdit을 true로 만들어줌. (해당 값을 기준으로 화면 렌더링)
  const openMemoEdit = useCallback(
    (objectId, verseText, content, memo) => {
      setMemoEditObjectId(objectId);
      setMemoEditVerseText(verseText);
      setMemoEditContent(content);
      setMemoEditMemo(memo);
      setMemoEditTextInput(memo);
      setIsOpenMemoEdit(true);
    },
    [memoEditObjectId, memoEditVerseText, memoEditMemo, memoEditContent, isOpenMemoEdit],
  );

  /**
   * 메모 수정화면에서 백버튼이 눌렸을때 동작함.
   * 백버튼이 눌리면 메모 수정화면에서, 메모목록 화면으로 넘어감.
   * 이후 메모 목록에서 수정페이지에서 바뀐 텍스트가 있으면 해당 메모를 objectId로 조회후 수정후 반영.
   */
  const backToMemoList = useCallback(async () => {
    let memoList = await getItemFromAsync<any[]>('memoList');

    if (memoList === null) memoList = [];

    const inputText = memoEditTextInput;

    let noteItems = [];
    // 바꿀 아이템 id 검색 후 수정
    const editItemIndex = memoList.findIndex(item => {
      return item.objectId === memoEditObjectId;
    });

    // 아무런 입력이 없다면 해당 노트 삭제 => memoList 배열에서 삭제시킴
    // 입력이 있다면 해당 노트 수정.
    if (inputText.length < 1) {
      memoList.splice(editItemIndex, 1);
      toastRef.current.show('노트가 삭제되었습니다 :)');
      updateVerseItems().then();
    } else {
      memoList[editItemIndex].memo = inputText;
      memoList[editItemIndex].date = new Date();
      toastRef.current.show('노트가 수정되었습니다. :)');
    }

    // 시간순서로 memoList 정렬
    // (시간에대한 내림차순으로 정렬됨) =>
    // 즉 나중에 수정된 아이가 유닉스 타임스탬프 시간이 크므로, 배열의 앞으로 들어가게 됨.
    // 따라서 방금 수정된 item => 나중에 수정된 item순으로 정렬된다.
    memoList.sort((a, b) => {
      const timestamp_a = new Date(a.date).getTime();
      const timestamp_b = new Date(b.date).getTime();
      return timestamp_a < timestamp_b ? -1 : timestamp_a > timestamp_b ? 1 : 0;
    });

    // 현재 아이템들에 대해서, 경과한 시간들을 계산한 뒤, noteItems로 push한다.
    // noteItems는 바뀐 memoList의 값을 state로 전달하는 기능 수행
    memoList.forEach(memoItem => {
      let passTimeText = getPassTimeText(memoItem.date);
      noteItems.push({
        objectId: memoItem.objectId,
        bookName: memoItem.bookName,
        chapterCode: memoItem.chapterCode,
        verseCode: memoItem.verseCode,
        memo: memoItem.memo,
        content: memoItem.content,
        passTimeText: passTimeText,
      });
    });

    // 아이템 갱신, 페이지 이동
    await setItemToAsync('memoList', memoList);
    setIsOpenMemoEdit(false);
    setNoteItems(noteItems);
  }, [isOpenMemoEdit, noteItems, memoEditTextInput]);

  const closeMemoComponent = useCallback(async () => {
    if (isOpenMemoEdit) {
      let memoList = await getItemFromAsync<any[]>('memoList');
      if (memoList === null) {
        memoList = [];
      }

      const inputText = memoEditTextInput;
      const editItemIndex = memoList.findIndex(item => {
        return item.objectId === memoEditObjectId;
      });

      // 아무런 입력이 없다면 해당 노트 삭제
      // 입력이 있다면 해당 노트 수정.
      if (inputText.length < 1) {
        memoList.splice(editItemIndex, 1);
        toastRef.current.show('노트가 삭제되었습니다 :)');
      } else {
        memoList[editItemIndex].memo = inputText;
        memoList[editItemIndex].date = new Date();

        // 시간순서로 memoList 정렬
        // (시간에대한 내림차순으로 정렬됨) =>
        // 즉 나중에 수정된 아이가 유닉스 타임스탬프 시간이 크므로, 배열의 앞으로 들어가게 됨.
        // 따라서 방금 수정된 item => 나중에 수정된 item순으로 정렬된다.
        memoList.sort((a, b) => {
          const timestamp_a = new Date(a.date).getTime();
          const timestamp_b = new Date(b.date).getTime();
          return timestamp_a < timestamp_b ? -1 : timestamp_a > timestamp_b ? 1 : 0;
        });

        toastRef.current.show('노트가 수정되었습니다 :)');
      }

      // 바뀐 정보를 저장한뒤 부모의 closeHandler호출
      setItemToAsync('memoList', memoList).then(() => {
        closeHandler();
      });
    } else {
      closeHandler();
    }
  }, [memoEditTextInput, memoEditObjectId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={{ position: 'absolute', left: 5 }} onPress={backToMemoList}>
          {isOpenMemoEdit ? (
            <View style={styles.headerLeftImageWrapper}>
              <Image style={styles.headerLeftImage} source={require('../../assets/ic_left_arrow.png')} />
            </View>
          ) : null}
        </TouchableOpacity>
        <Text style={styles.headerText}>성경노트</Text>
        <TouchableOpacity style={{ position: 'absolute', right: 5 }} onPress={closeMemoComponent}>
          <View style={styles.headerRightImageWrapper}>
            <Image style={styles.headerRightImage} source={require('../../assets/ic_close.png')} />
          </View>
        </TouchableOpacity>
      </View>
      {noteItems.length === 0 && isNoteItemUpdate && (
        <View style={styles.memoNone}>
          <Image style={styles.memoNoneImage} source={require('../../assets/ic_note.png')} />
          <Text style={styles.memoNoneText}>메모한 흔적이 없어요.{'\n'}너무 소홀하셨던거 아닐까요?</Text>
        </View>
      )}

      {!isOpenMemoEdit && (
        <FlatList
          style={styles.flatList}
          data={noteItems}
          keyExtractor={(item, index) => item.toString() + index.toString() + item.content}
          renderItem={({ item, index }) => {
            const { objectId, bookName, chapterCode, verseCode, content, memo, passTimeText } = item;
            const verseText = `${bookName} ${chapterCode}장 ${verseCode}절`;
            return (
              <View>
                <TouchableOpacity onPress={() => openMemoEdit(objectId, verseText, content, memo)}>
                  <View style={styles.memoItem}>
                    <Text style={styles.memoItemIndex}>{index + 1}.</Text>
                    <View style={styles.memoItemContent}>
                      <Text style={styles.memoItemContentVerseText}>{verseText}</Text>
                      <Text style={styles.memoItemContentMemo}>{memo.toString()}</Text>
                      <Text style={styles.memoItemContentDate}>{passTimeText}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      {isOpenMemoEdit && (
        <View style={styles.memoEdit}>
          <View style={styles.memoEditHeader}>
            <Text style={styles.memoEditVerseText}>{memoEditVerseText}</Text>
            <Text style={styles.memoEditContent}>{memoEditContent}</Text>
          </View>
          <TextInput
            style={styles.memoEditMemo}
            // onContentSizeChange={this._onTextContentSizeChange}
            onChangeText={text => setMemoEditTextInput(text)}>
            {memoEditMemo}
          </TextInput>
        </View>
      )}

      <Toast ref={toastRef} positionValue={160} fadeInDuration={200} fadeOutDuration={1000} />
    </View>
  );
};

export default BibleNoteOption;

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

  memoNone: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    width: '100%',
    height: '85%',
  },

  memoNoneImage: {
    width: 70,
    height: 80,
    resizeMode: 'contain',
  },

  memoNoneText: {
    marginTop: 28,
    color: '#BDBDBD',
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
  },

  memoItem: {
    marginLeft: 14,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderColor: '#AEAEAE',
    flexDirection: 'row',
  },

  memoItemIndex: {
    fontWeight: 'bold',
  },

  memoItemContent: {
    marginLeft: 14,
    marginTop: 3,
    marginRight: 16,
  },

  memoItemContentVerseText: {
    fontSize: 12,
    color: '#828282',
  },

  memoItemContentMemo: {
    fontWeight: 'bold',
    marginTop: 7,
  },

  memoItemContentDate: {
    fontSize: 12,
    color: '#828282',
    marginTop: 7,
  },

  memoEditHeader: {
    paddingTop: 30,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 40,
    borderBottomWidth: 1,
    borderColor: '#AEAEAE',
  },

  memoEditVerseText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  memoEditContent: {
    marginTop: 11,
  },

  memoEditMemo: {
    paddingLeft: 15,
    paddingRight: 15,
    width: '100%',
  },

  memoEdit: {},
});
