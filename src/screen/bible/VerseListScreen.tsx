import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Clipboard } from 'react-native';
import Toast from 'react-native-easy-toast';
import { getBibleVerseItems, getItemFromAsyncStorage, getBibleTypeString, setItemToAsyncStorage, getBibleType } from '../../utils';
import CommandModal from '../../components/verselist/commandModal/CommandModal';
import BibleListOption from '../../components/verselist/biblelistOption/BibleListOption';
import BibleNoteOption from '../../components/verselist/bottomOptionModal/BibleNoteOption';
import FontChangeOption from '../../components/verselist/bottomOptionModal/FontChangeOption';
import { StackActions } from '@react-navigation/native';
import MemoModal from '../../components/verselist/commandModal/MemoModal';
import VerseFlatList from '../../components/verselist/VerseFlatList/VerseFlatList';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FONT_FAMILY_OPTION, FONT_SIZE_OPTION, HIGHLIGHT_LIST, RECENTLY_READ_BIBLE_LIST, MEMO_LIST } from '../../constraints';
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
  isMemo?: boolean;
}

export interface VerseItemList extends Array<VerseItem> {}

const VerseListScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [verseItems, setVerseItems] = useState<VerseItemList>([]);
  const [commandModalVisible, setCommandModalVisible] = useState(false);
  const [memoModalVisible, setMemoModalVisible] = useState(false);
  const [bibleListOptionIconUri, setBibleListOptionIconUri] = useState(require('../../assets/ic_option_list_off.png'));
  const [bibleNoteOptionIconUri, setBibleNoteOptionIconUri] = useState(require('../../assets/ic_option_note_off.png'));
  const [fontChangeOptionIconUri, setFontChangeOptionIconUri] = useState(require('../../assets/ic_option_font_off.png'));
  const [optionComponentState, setOptionComponentState] = useState('');
  const [bibleType, setBibleType] = useState(0);
  const [modalBibleItem, setModalBibleItem] = useState({});
  const [verseItemFontSize, setVerseItemFontSize] = useState(14);
  const [verseItemFontFamily, setVerseItemFontFamily] = useState('system font');
  const toastRef = useRef(null);

  // 최근 읽은 성경을 AsyncStorage에 저장.
  const saveRecentlyReadBibleList = useCallback(async (bibleName, bookName, bookCode, chapterCode, verseSentence) => {
    let recentlyReadBibleList = await getItemFromAsyncStorage<RecentlyReadBibleList | null>(RECENTLY_READ_BIBLE_LIST);

    console.log(recentlyReadBibleList);
    if (!recentlyReadBibleList) {
      recentlyReadBibleList = [];
    }

    const readItem = {
      bibleName,
      bookName,
      bookCode,
      chapterCode,
      verseSentence,
      createdAt: new Date(),
    };

    recentlyReadBibleList.push(readItem);
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

  const getUpdatedMemoVerseItems: (items: VerseItemList) => Promise<VerseItemList> = useCallback(
    async (items: VerseItemList) => {
      let memoListItems = await getItemFromAsyncStorage<any[]>(MEMO_LIST);
      if (memoListItems === null) memoListItems = [];
      items.forEach(verse => {
        const index = memoListItems.findIndex(memoItem => {
          return (
            memoItem.bookCode === verse.bookCode && memoItem.chapterCode === verse.chapterCode && memoItem.verseCode === verse.verseCode
          );
        });
        verse.isMemo = index > -1;
      });

      return items;
    },
    [verseItems],
  );

  // 성경 아이템 업데이트
  // 1. 최근 읽은 성경 주소 저장
  // 2. VerseItem을 입력받아 하이라이트 처리
  // 3. VerseItem을 입력받아 memo 처리
  const updateVerseItems = useCallback(async () => {
    const { bookName, bookCode, chapterCode } = route.params;
    let verseItems: VerseItemList = await getBibleVerseItems(bookName, bookCode, chapterCode);
    verseItems = await getUpdatedHighlightVerseItems(verseItems);
    verseItems = await getUpdatedMemoVerseItems(verseItems);

    setVerseItems(verseItems);
    setBibleType(getBibleType(bookCode));
    setIsLoading(false);

    return verseItems;
  }, [verseItems]);

  useEffect(() => {
    const { isFromRecentlyReadPageButtonClick } = route.params;
    (async () => {
      // 해당 절의 첫번째 구절을 최근 읽은 성경에 저장
      const verseItem = await updateVerseItems();

      // 링크 버튼으로 부터 클릭되었을때는 최근읽은 성경 목록에 저장 안함.
      if (!isFromRecentlyReadPageButtonClick) {
        const bibleName = getBibleTypeString(verseItem[0].bookCode);
        await saveRecentlyReadBibleList(
          bibleName,
          verseItem[0].bookName,
          verseItem[0].bookCode,
          verseItem[0].chapterCode,
          verseItem[0].content,
        );
      }

      await setFontSizeFromStorage();
      await setFontFamilyFromStorage();
    })();
  }, []);

  useEffect(() => {
    console.log(verseItems);
    if (verseItems) {
      console.log('222');
    }
  }, [verseItems]);

  // commandModal에 대한 동작 수행 => 복사, 하이라이트, 메모에 대한 동작 수행 modal을 commandModal이라고 정의함
  // 1. 복사가 눌리면 클립보드 저장
  // 2. 하이라이트가 눌리면, 하이라이트 부분 처리
  // 3. 메모가 눌리면 memoModal 동작시킴
  const actionCommandModal = useCallback(
    async modalAction => {
      const { bookCode, chapterCode, verseCode, content, isHighlight } = modalBibleItem;
      const removeHighlight = async () => {
        let highlightItems = await getItemFromAsyncStorage<any[]>(HIGHLIGHT_LIST);
        if (highlightItems === null) {
          highlightItems = [];
        }

        const index = highlightItems.findIndex((item, index) => {
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
          setMemoModalVisible(true);
          break;
        }
      }
    },
    [modalBibleItem],
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
      setModalBibleItem(verseItem);
      setCommandModalVisible(true);
    },
    [verseItems],
  );

  if (isLoading) {
    return <LoadingSpinner />;
  } else {
    return (
      <View style={styles.container}>
        <CommandModal
          modalBibleItem={modalBibleItem}
          setCommandModalVisible={setCommandModalVisible}
          commandModalVisible={commandModalVisible}
          actionCommandModal={actionCommandModal}
          openBibleNoteOptionModal={openBibleNoteOptionModal}
        />

        <MemoModal
          modalBibleItem={modalBibleItem}
          memoModalVisible={memoModalVisible}
          setMemoModalVisible={setMemoModalVisible}
          updateVerseItems={updateVerseItems}
          toastRef={toastRef}
        />

        <VerseFlatList
          navigation={navigation}
          verseItems={verseItems}
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
          <BibleListOption navigation={navigation} bibleType={bibleType} closeHandler={closeAllOptionModal} />
        )}
        {optionComponentState === 'bibleNote' && (
          <BibleNoteOption toastRef={toastRef} closeHandler={closeAllOptionModal} updateVerseItems={updateVerseItems} />
        )}
        {optionComponentState === 'fontChange' && (
          <FontChangeOption
            changeFontSizeHandler={setVerseItemFontSize}
            changeFontFamilyHandler={setVerseItemFontFamily}
            closeHandler={closeAllOptionModal}
          />
        )}

        <Toast ref={toastRef} positionValue={130} fadeInDuration={200} fadeOutDuration={1000} />
      </View>
    );
  }
};

export default VerseListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: 'white',
  },

  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  flatList: {
    flexDirection: 'column',
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
    borderWidth: 1.5,
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
