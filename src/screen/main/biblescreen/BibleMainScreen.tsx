import React, { useCallback, useEffect, useRef, useState } from 'react';
import { fetchDataFromSqlite, getItemFromAsyncStorage, setItemToAsyncStorage } from '../../../utils';
import { StyleSheet, View, SafeAreaView } from 'react-native';

import Toast from 'react-native-easy-toast';
import firestore from '@react-native-firebase/firestore';
import MainBibleView from '../../../components/biblemain/MainBibleView';
import { getBibleTypeString, getOldBibleItems, getNewBibleItems, getBibleType } from '../../../utils';
import { StackActions } from '@react-navigation/native';
import LatelyReadBibleView from '../../../components/biblemain/LatelyReadBibleView';
import SearchHeaderView from '../../../components/biblemain/SearchHeaderView';
import SearchResultView from '../../../components/biblemain/SearchResultView';
import { LATELY_READ_LIST, SEARCH_WORD_LIST } from '../../../constraints';
import SearchWordListView from '../../../components/biblemain/SearchWordListView';

const BibleMainScreen = props => {
  const [isShowMainBibleView, setIsShowMainBibleView] = useState(true);
  const [isShowSearchWordListView, setIsShowSearchWordListView] = useState(false);
  const [isShowCurrentWordView, setIsShowCurrentWordView] = useState(false);
  const [isShowSearchResultView, setIsShowSearchResultView] = useState(false);
  const [isShowLatelyReadBibleView, setIsShowLatelyReadBibleView] = useState(false);

  const [searchWordItems, setSearchWordItems] = useState([]);
  const [textInputPlaceHolder, setTextInputPlaceHolder] = useState('다시 읽고 싶은 말씀이 있나요?');
  const [searchResultItems, setSearchResultItems] = useState([]);
  const [latelyReadItem, setLatelyReadItem] = useState({});

  const [verseSentence, setVerseSentence] = useState('');
  const [verseString, setVerseString] = useState('');

  const textInputRef = useRef(null);
  const toastRef = useRef(null);

  // 구약, 신약 성경 '장' 페이지로 이동하는 Link
  const goToBookListScreen = useCallback(
    (type: 0 | 1) => {
      props.navigation.navigate('BookListScreen', { bibleType: type });
      setIsShowLatelyReadBibleView(false);
    },
    [isShowLatelyReadBibleView],
  );

  // 최근 읽은 성경 가기 Link
  const goToLatestReadScreen = useCallback((bookName, bookCode, chapterCode) => {
    const navigation = props.navigation;
    const bibleType = getBibleType(bookCode);
    const pushBookList = StackActions.push('BookListScreen', {
      bibleType,
    });
    navigation.dispatch(pushBookList);

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

    setIsShowLatelyReadBibleView(false);
  }, []);
  const textInputFocus = useCallback(() => {
    setIsShowMainBibleView(false);
    setIsShowSearchWordListView(true);
    setIsShowLatelyReadBibleView(false);
  }, []);

  const searchCancelPress = useCallback(() => {
    if (textInputRef.current.value !== '') {
      textInputRef.current.setNativeProps({
        text: '',
      });
      textInputRef.current.value = '';
      setIsShowSearchResultView(false);
      return;
    }

    textInputRef.current.blur();
    textInputRef.current.clear();

    setIsShowMainBibleView(true);
    setIsShowSearchWordListView(false);
    setIsShowCurrentWordView(false);
    setIsShowSearchResultView(false);
    setTextInputPlaceHolder('다시 읽고 싶은 말씀이 있나요?');
    // setSearchText('');
  }, []);
  const searchPress = useCallback(async () => {
    /**
     *  왼쪽 상단 검색버튼 눌렀을때의 동작 로직.
     *  0. text가 2개 이상일때만 검색 수행
     *  1. AsyncStorage에 현재 textInput의 값 저장.
     *  2. 현재 검색 단어(searchWordList) 가 6개 이상일경우 1개의 아이템을 제거함.
     *  3. 현재 입력 단어(currentWordView)를 열어서 현재 검색한 단어를 화면에 보여줌.
     *  4. 현재 검색 단어(searchWordList)를 화면에서 없애고, 검색 결과 성경(searchResultView)에 대한 쿼리 진행
     */
    const searchText = textInputRef.current.value;

    if (searchText.length === 0) {
      return;
    }

    textInputRef.current.blur();
    textInputRef.current.clear();

    if (searchText.length < 2) {
      toastRef.current.show('2자 이상으로 검색어를 입력해주세요 :)');
      return;
    }

    let searchWordItems = await getItemFromAsyncStorage<any[] | null>(SEARCH_WORD_LIST);
    if (searchWordItems === null) {
      searchWordItems = [];
    }
    searchWordItems.push(searchText);

    if (searchWordItems.length > 5) {
      searchWordItems.shift();
    }

    await setItemToAsyncStorage(SEARCH_WORD_LIST, searchWordItems);
    setSearchWordItems(searchWordItems);

    const result = await fetchDataFromSqlite(`SELECT book, chapter, verse, content from bible_korHRV WHERE content LIKE '%${searchText}%'`);
    const searchResultItems = [];
    for (let i = 0; i < result.rows.length; i++) {
      const bookCode = result.rows.item(i).book;
      const bibleName = getBibleTypeString(bookCode);
      const bibleItems = bibleName === '구약' ? getOldBibleItems() : getNewBibleItems();
      const bookName = bibleItems.find(item => {
        return item.bookCode === bookCode;
      }).bookName;
      const chapterCode = result.rows.item(i).chapter;
      const verseCode = result.rows.item(i).verse;
      const content = result.rows.item(i).content;

      searchResultItems.push({
        bibleName,
        bookName,
        bookCode,
        chapterCode,
        verseCode,
        content,
      });
    }

    setIsShowSearchWordListView(false);
    setIsShowSearchResultView(true);
    setIsShowCurrentWordView(true);
    setIsShowMainBibleView(false);

    setSearchResultItems(searchResultItems);
    setTextInputPlaceHolder('');
  }, []);
  const moveToBibleChapter = useCallback(item => {
    const { bookCode, bookName, chapterCode } = item;

    const pushVerseList = StackActions.push('VerseListScreen', {
      bookCode,
      bookName,
      chapterCode,
    });
    props.navigation.dispatch(pushVerseList);
  }, []);

  useEffect(() => {
    // 검색했던 단어들에 대한 List를 Local DB에서 불러옴
    const initSearchWordsFromStorage = async () => {
      let searchWordList = await getItemFromAsyncStorage<any[]>(SEARCH_WORD_LIST);
      if (searchWordList === null) {
        setSearchWordItems([]);
      } else {
        setSearchWordItems(searchWordList);
      }
    };

    // 최근 읽은 성경구절 정보를 LocalDB에서 가져옴
    const initLatestReadListFromStorage = async () => {
      let latelyReadList = await getItemFromAsyncStorage<Record<string, any>>(LATELY_READ_LIST);
      if (latelyReadList === null) {
        setIsShowLatelyReadBibleView(false);
      } else {
        /** 만약 최근 읽은 성경구절 정보가 있다면, 이어보기 화면을 출력 **/
        const { bibleName, bookName, bookCode, chapterCode } = latelyReadList;
        setLatelyReadItem({ bibleName, bookName, bookCode, chapterCode });
        setIsShowLatelyReadBibleView(true);
      }
    };

    // 서버에서 오늘의 성경을 가져와 화면에 출력.
    const initTodayVerseFromFirebase = async () => {
      const todayVerseDocument = await firestore().collection('todayVerse').doc('data').get();

      const { content, versePath } = todayVerseDocument.data();

      if (content && versePath) {
        setVerseSentence(content);
        setVerseString(versePath);
      }
    };

    (async () => {
      await initSearchWordsFromStorage();
      await initLatestReadListFromStorage();
      await initTodayVerseFromFirebase();
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.contentContainer}>
        <SearchHeaderView
          searchCancelPress={searchCancelPress}
          searchPress={searchPress}
          textInputFocus={textInputFocus}
          textInputPlaceHolder={textInputPlaceHolder}
          textInputRef={textInputRef}
        />

        {isShowMainBibleView && (
          <>
            <MainBibleView goToBookListScreen={goToBookListScreen} verseSentence={verseSentence} verseString={verseString} />
            {isShowLatelyReadBibleView && (
              <LatelyReadBibleView goToLatestReadScreen={goToLatestReadScreen} latelyReadItem={latelyReadItem} />
            )}
          </>
        )}

        {!isShowMainBibleView && (
          <>
            {isShowSearchResultView ? (
              <SearchResultView searchResultItems={searchResultItems} moveToBibleChapter={moveToBibleChapter} />
            ) : (
              <SearchWordListView searchWordItems={searchWordItems} textInputRef={textInputRef} />
            )}
          </>
        )}
      </View>
      <Toast ref={toastRef} positionValue={130} fadeInDuration={200} fadeOutDuration={1000} />
    </SafeAreaView>
  );
};

export default BibleMainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    height: '100%',
    justifyContent: 'flex-start',
  },

  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    height: '100%',
    justifyContent: 'center',
  },
});
