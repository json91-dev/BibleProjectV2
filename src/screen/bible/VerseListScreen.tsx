import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-easy-toast';
import { getBibleVerseItems, getItemFromAsyncStorage, getBibleTypeString, setItemToAsyncStorage, getBibleType } from '../../utils';
import CommandModal from '../../components/verselist/modal/CommandModal';
import BibleListModal from '../../components/verselist/modal/biblelist/BibleListModal';
import NoteListModal from '../../components/verselist/modal/note/NoteListModal';
import FontChangeModal from '../../components/verselist/modal/FontChangeModal';
import { StackActions } from '@react-navigation/native';
import NoteWriteModal from '../../components/verselist/modal/note/NoteWriteModal';
import VerseFlatList from '../../components/verselist/VerseFlatList/VerseFlatList';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FONT_FAMILY_OPTION, FONT_SIZE_OPTION, HIGHLIGHT_LIST, RECENTLY_READ_BIBLE_LIST, NOTE_LIST } from '../../constraints';
import { RecentlyReadBibleList } from './RecentlyReadBibleListScreen';

export interface VerseItem {
  isButton: boolean;
  bookName: string;
  bookCode: number;
  chapterCode: number;
  content: string;
  verseCode: string;
  maxChapterCode: string;
  isHighlight?: boolean;
  isCreatedNote?: boolean;
}

export interface VerseItemList extends Array<VerseItem> {}

const VerseListScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [verseItemList, setVerseItemList] = useState<VerseItemList>([]);
  const [commandModalVisible, setCommandModalVisible] = useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [bibleListOptionIconUri, setBibleListOptionIconUri] = useState(require('../../assets/ic_option_list_off.png'));
  const [bibleNoteOptionIconUri, setBibleNoteOptionIconUri] = useState(require('../../assets/ic_option_note_off.png'));
  const [fontChangeOptionIconUri, setFontChangeOptionIconUri] = useState(require('../../assets/ic_option_font_off.png'));
  const [optionComponentState, setOptionComponentState] = useState('');
  const [bibleType, setBibleType] = useState(0);
  const [modalVerseItem, setModalVerseItem] = useState<VerseItem | Record<any, any>>({});
  const [verseItemFontSize, setVerseItemFontSize] = useState(14);
  const [verseItemFontFamily, setVerseItemFontFamily] = useState('system font');
  const toastRef = useRef(null);

  // 최근 읽은 성경을 AsyncStorage에 저장.
  const saveRecentlyReadBible = useCallback(async (bibleName, bookName, bookCode, chapterCode, verseSentence) => {
    let recentlyReadBibleList = await getItemFromAsyncStorage<RecentlyReadBibleList | null>(RECENTLY_READ_BIBLE_LIST);

    if (!recentlyReadBibleList) {
      recentlyReadBibleList = [];
    }

    const existingIndex = recentlyReadBibleList.findIndex(item => item.bookCode === bookCode);

    if (existingIndex !== -1) {
      // 이미 존재하는 경우
      const existingItem = recentlyReadBibleList.splice(existingIndex, 1)[0];
      existingItem.bibleName = bibleName;
      existingItem.bookName = bookName;
      existingItem.chapterCode = chapterCode;
      existingItem.verseSentence = verseSentence;
      existingItem.timestamp = new Date().getTime();
      recentlyReadBibleList.unshift(existingItem);
    } else {
      const readItem = {
        bibleName,
        bookName,
        bookCode,
        chapterCode,
        verseSentence,
        timestamp: new Date().getTime(),
      };
      recentlyReadBibleList.unshift(readItem);
    }

    await setItemToAsyncStorage(RECENTLY_READ_BIBLE_LIST, recentlyReadBibleList);
  }, []);

  const setFontSizeFromStorage = useCallback(async () => {
    const fontSizeOption = await getItemFromAsyncStorage<number>(FONT_SIZE_OPTION);
    switch (fontSizeOption) {
      case null: {
        setVerseItemFontSize(14);
        break;
      }

      case 0: {
        setVerseItemFontSize(12);
        break;
      }

      case 1: {
        setVerseItemFontSize(14);
        break;
      }

      case 2: {
        setVerseItemFontSize(16);
        break;
      }

      case 3: {
        setVerseItemFontSize(18);
        break;
      }
    }
  }, []);

  const setFontFamilyFromStorage = useCallback(async () => {
    const fontFamilyOption = await getItemFromAsyncStorage<number>(FONT_FAMILY_OPTION);
    switch (fontFamilyOption) {
      case null: {
        setVerseItemFontFamily('system font');
        break;
      }

      case 0: {
        setVerseItemFontFamily('system font');
        break;
      }

      case 1: {
        setVerseItemFontFamily('NanumBrush');
        break;
      }

      case 2: {
        setVerseItemFontFamily('TmonMonsoriBlack');
        break;
      }

      case 3: {
        setVerseItemFontFamily('KoreanGIR-L');
        break;
      }
    }
  }, []);

  const getUpdatedHighlightVerseItems: (items: VerseItemList) => Promise<VerseItemList> = useCallback(async (items: VerseItemList) => {
    let highlightsItems = await getItemFromAsyncStorage<any[]>(HIGHLIGHT_LIST);
    highlightsItems = highlightsItems ? highlightsItems : [];

    items.forEach(verse => {
      const index = highlightsItems.findIndex(highlightItem => {
        return (
          highlightItem.bookCode === verse.bookCode &&
          highlightItem.chapterCode === verse.chapterCode &&
          highlightItem.verseCode === verse.verseCode
        );
      });
      verse.isHighlight = index > -1;
    });

    return items;
  }, []);

  const getUpdatedNoteVerseItems: (items: VerseItemList) => Promise<VerseItemList> = useCallback(
    async (items: VerseItemList) => {
      let noteList = await getItemFromAsyncStorage<any[]>(NOTE_LIST);
      if (noteList === null) noteList = [];
      items.forEach(verse => {
        const index = noteList.findIndex(noteItem => {
          return (
            noteItem.bookCode === verse.bookCode && noteItem.chapterCode === verse.chapterCode && noteItem.verseCode === verse.verseCode
          );
        });
        verse.isCreatedNote = index > -1;
      });

      return items;
    },
    [verseItemList],
  );

  // 성경 아이템 업데이트
  // 1. 최근 읽은 성경 주소 저장
  // 2. VerseItem을 입력받아 하이라이트 처리
  // 3. VerseItem을 입력받아 memo 처리
  const updateVerseItems = useCallback(async () => {
    const { bookName, bookCode, chapterCode } = route.params;
    let verseItemList: VerseItemList = await getBibleVerseItems(bookName, bookCode, chapterCode);
    verseItemList = await getUpdatedHighlightVerseItems(verseItemList);
    verseItemList = await getUpdatedNoteVerseItems(verseItemList);

    console.log('11');
    setVerseItemList(verseItemList);
    setBibleType(getBibleType(bookCode));
    setIsLoading(false);

    return verseItemList;
  }, [verseItemList]);

  useEffect(() => {
    const { isFromRecentlyReadPageButtonClick } = route.params;
    (async () => {
      // 해당 절의 첫번째 구절을 최근 읽은 성경에 저장
      await setFontSizeFromStorage();
      await setFontFamilyFromStorage();

      const verseItem = await updateVerseItems();

      // 링크 버튼으로 부터 클릭되었을때는 최근읽은 성경 목록에 저장 안함.
      if (!isFromRecentlyReadPageButtonClick) {
        const bibleName = getBibleTypeString(verseItem[0].bookCode);
        await saveRecentlyReadBible(
          bibleName,
          verseItem[0].bookName,
          verseItem[0].bookCode,
          verseItem[0].chapterCode,
          verseItem[0].content,
        );
      }
    })();
  }, []);

  useEffect(() => {
    console.log(verseItemList);
    if (verseItemList) {
      console.log('222');
    }
  }, [verseItemList]);

  // commandModal에 대한 동작 수행 => 복사, 하이라이트, 메모에 대한 동작 수행 modal을 commandModal이라고 정의함
  // 1. 복사가 눌리면 클립보드 저장
  // 2. 하이라이트가 눌리면, 하이라이트 부분 처리
  // 3. 메모가 눌리면 memoModal 동작시킴
  const actionCommandModal = useCallback(
    async (modalAction: 'copy' | 'highlight' | 'memo') => {
      const { bookCode, chapterCode, verseCode, content, isHighlight } = modalVerseItem;
      const removeHighlight = async () => {
        let highlightItems = await getItemFromAsyncStorage<any[]>(HIGHLIGHT_LIST);
        if (highlightItems === null) {
          highlightItems = [];
        }

        const index = highlightItems.findIndex(item => {
          return item.bookCode === bookCode && item.chapterCode === chapterCode && item.verseCode === verseCode;
        });
        highlightItems.splice(index, 1);
        await setItemToAsyncStorage(HIGHLIGHT_LIST, highlightItems);
        toastRef.current.show('형광펜 밑줄 제거 ^^');
      };

      const addHighlight = async () => {
        let highlightItems = await getItemFromAsyncStorage<any[]>(HIGHLIGHT_LIST);

        if (highlightItems === null) {
          highlightItems = [];
        }
        highlightItems.push({ bookCode, chapterCode, verseCode });

        await setItemToAsyncStorage(HIGHLIGHT_LIST, highlightItems);
        toastRef.current.show('형광펜으로 밑줄 ^^');
      };

      switch (modalAction) {
        case 'copy': {
          Clipboard.setString(content);
          toastRef.current.show('클립보드에 복사되었습니다.');
          break;
        }
        case 'highlight': {
          if (isHighlight) {
            await removeHighlight();
          } else {
            await addHighlight();
          }
          updateVerseItems().then();
          break;
        }
        case 'memo': {
          setNoteModalVisible(true);
          break;
        }
      }
    },
    [modalVerseItem],
  );

  /** TODO 모달 여는 함수 하나로 만들기 **/
  // 하단 3개의 옵션 버튼중 성경 목록 보기 열기
  const openBibleListOptionModal = useCallback(() => {
    setCommandModalVisible(false);
    setOptionComponentState('bibleList');
    setBibleListOptionIconUri(require('../../assets/ic_option_list_on.png'));
    setBibleNoteOptionIconUri(require('../../assets/ic_option_note_off.png'));
    setFontChangeOptionIconUri(require('../../assets/ic_option_font_off.png'));
  }, [commandModalVisible, optionComponentState]);

  // 하단 3개의 옵션 버튼중 성경 노트 열기
  const openBibleNoteOptionModal = useCallback(() => {
    setCommandModalVisible(false);
    setOptionComponentState('bibleNote');
    setBibleListOptionIconUri(require('../../assets/ic_option_list_off.png'));
    setBibleNoteOptionIconUri(require('../../assets/ic_option_note_on.png'));
    setFontChangeOptionIconUri(require('../../assets/ic_option_font_off.png'));
  }, [commandModalVisible, optionComponentState]);

  // 하단 3개의 옵션 버튼중 폰트 열기
  const openFontChangeOptionModal = useCallback(() => {
    setCommandModalVisible(false);
    setOptionComponentState('fontChange');
    setBibleListOptionIconUri(require('../../assets/ic_option_list_off.png'));
    setBibleNoteOptionIconUri(require('../../assets/ic_option_note_off.png'));
    setFontChangeOptionIconUri(require('../../assets/ic_option_font_on.png'));
  }, [commandModalVisible, optionComponentState]);

  /** 하단 3개의 옵션 버튼 모두 닫기 **/
  const closeAllOptionModal = useCallback(() => {
    setOptionComponentState('default');
    setBibleListOptionIconUri(require('../../assets/ic_option_list_off.png'));
    setBibleNoteOptionIconUri(require('../../assets/ic_option_note_off.png'));
    setFontChangeOptionIconUri(require('../../assets/ic_option_font_off.png'));
  }, []);

  const changeScreenNavigation = (bookName, bookCode, chapterCode) => () => {
    const popAction = StackActions.pop(2);
    navigation.dispatch(popAction);

    const pushChapterList = StackActions.push('ChapterListScreen', {
      bookCode,
      bookName,
    });
    navigation.dispatch(pushChapterList);

    const pushVerseList = StackActions.push('VerseListScreen', {
      bookCode,
      bookName,
      chapterCode,
    });
    navigation.dispatch(pushVerseList);
  };

  // 성경의 아이템을 길게 눌렀을때 모달 화면을 보여주는 메서드.
  // 복사, 형광펜, 메모 기능을 위해 해당 값을 전달받는다.
  const onLongPressButton = useCallback(
    verseItem => {
      setModalVerseItem(verseItem);
      setCommandModalVisible(true);
    },
    [verseItemList],
  );

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <SafeAreaView style={styles.container}>
          <CommandModal
            modalVerseItem={modalVerseItem}
            setCommandModalVisible={setCommandModalVisible}
            commandModalVisible={commandModalVisible}
            actionCommandModal={actionCommandModal}
            openBibleNoteOptionModal={openBibleNoteOptionModal}
          />

          <NoteWriteModal
            modalVerseItem={modalVerseItem}
            noteModalVisible={noteModalVisible}
            setNoteModalVisible={setNoteModalVisible}
            updateVerseItems={updateVerseItems}
            toastRef={toastRef}
          />

          <VerseFlatList
            navigation={navigation}
            verseItemList={verseItemList}
            verseItemFontSize={verseItemFontSize}
            verseItemFontFamily={verseItemFontFamily}
            onLongPressButton={onLongPressButton}
          />

          {/* 하단 목차, 성경노트, 보기설정에 대한 footer option */}
          <View style={styles.footerOptionContainer}>
            <TouchableOpacity style={styles.footerOptionContainerItem} onPress={openBibleListOptionModal}>
              <Image style={styles.footerOptionIcon} source={bibleListOptionIconUri} />
              <Text>목차</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerOptionContainerItem} onPress={openBibleNoteOptionModal}>
              <Image style={styles.footerOptionIcon} source={bibleNoteOptionIconUri} />
              <Text>성경노트</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerOptionContainerItem} onPress={openFontChangeOptionModal}>
              <Image style={styles.footerOptionIcon} source={fontChangeOptionIconUri} />
              <Text>보기설정</Text>
            </TouchableOpacity>
          </View>

          {optionComponentState === 'bibleList' && (
            <BibleListModal navigation={navigation} bibleType={bibleType} closeHandler={closeAllOptionModal} />
          )}
          {optionComponentState === 'bibleNote' && (
            <NoteListModal toastRef={toastRef} closeHandler={closeAllOptionModal} updateVerseItems={updateVerseItems} />
          )}
          {optionComponentState === 'fontChange' && (
            <FontChangeModal
              changeFontSizeHandler={setVerseItemFontSize}
              changeFontFamilyHandler={setVerseItemFontFamily}
              closeHandler={closeAllOptionModal}
            />
          )}
        </SafeAreaView>
      )}

      <Toast ref={toastRef} positionValue={130} fadeInDuration={200} fadeOutDuration={1000} />
    </>
  );
};

export default VerseListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },

  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
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

  modalHeader: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10,
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

  /* 푸터 옵션 */
  footerOptionContainer: {
    borderWidth: 1.5,
    zIndex: 200,
    position: 'absolute',
    left: '2.5%',
    bottom: 25,
    width: '95%',
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 15,
    borderColor: '#DDDDDD',
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
    marginBottom: 3,
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
