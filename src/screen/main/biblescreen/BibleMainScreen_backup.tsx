import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getItemFromAsyncStorage, setItemToAsyncStorage } from '../../../utils';
import { StyleSheet, View, SafeAreaView } from 'react-native';

import Toast from 'react-native-easy-toast';
import firestore from '@react-native-firebase/firestore';
import MainBibleView from '../../../components/biblemain/MainBibleView';
import { getBibleTypeString, getOldBibleItems, getNewBibleItems, getSqliteDatabase, getBibleType } from '../../../utils';
import { StackActions } from '@react-navigation/native';
import LatelyReadBibleView from '../../../components/biblemain/LatelyReadBibleView';
import SearchHeaderView from '../../../components/biblemain/SearchHeaderView';
import SearchResultView from '../../../components/biblemain/SearchResultView';
import { LATELY_READ_LIST, SEARCH_WORD_LIST } from '../../../constraints';

const BibleMainScreen = props => {
  const [isOpenSearchMode, setIsOpenSearchMode] = useState(false);
  const [isOpenSearchWordListView, setIsOpenSearchWordListView] = useState(false);
  const [searchWordItems, setSearchWordItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchTextPlaceHolder, setSearchTextPlaceHolder] = useState('다시 읽고 싶은 말씀이 있나요?');
  const [searchTextEditable, setSearchTextEditable] = useState(true);
  const [isOpenCurrentWordView, setIsOpenCurrentWordView] = useState(false);
  const [currentWordText, setCurrentWordText] = useState('');
  const [isOpenSearchResultView, setIsOpenSearchResultView] = useState(false);
  const [searchResultItems, setSearchResultItems] = useState([]);
  const [isOpenLatelyReadBibleView, setIsOpenLatelyReadBibleView] = useState(false);
  const [latelyReadItem, setLatelyReadItem] = useState({});
  const [verseSentence, setVerseSentence] = useState('너는 하나님과 화목하고 평안하라, 그리하면 복이 네게 임하리라.');
  const [verseString, setVerseString] = useState('요한복음 1장 27절');
  const textInputRef = useRef(null);
  const toastRef = useRef(null);

  // 구약, 신약 성경 '장' 페이지로 이동하는 Link
  const goToBookListScreen = useCallback(
    (type: 0 | 1) => {
      props.navigation.navigate('BookListScreen', { bibleType: type });
      setIsOpenLatelyReadBibleView(false);
    },
    [isOpenLatelyReadBibleView],
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

    setIsOpenLatelyReadBibleView(false);
  }, []);

  /** 상단 Search Text Focus **/
  const searchHeaderViewTextFocus = useCallback(() => {
    setIsOpenSearchMode(true);
    setIsOpenSearchWordListView(true);
    setIsOpenLatelyReadBibleView(false);
  }, []);

  const searchHeaderViewTextBlur = useCallback(() => {}, []);

  /** 상단 Search Text Change **/
  const searchHeaderViewTextOnChange = useCallback(
    text => {
      setSearchText(text);
    },
    [searchText],
  );

  /** 상단 Search 취소 버튼 클릭 **/
  const searchHeaderViewCancelPress = useCallback(() => {
    textInputRef.current.blur();
    textInputRef.current.clear();

    setIsOpenSearchMode(false);
    setIsOpenSearchWordListView(false);
    setIsOpenCurrentWordView(false);
    setIsOpenSearchResultView(false);
    setCurrentWordText('');
    setSearchTextPlaceHolder('다시 일고 싶은 말씀이 있나요?');
    setSearchTextEditable(true);
    setSearchText('');
  }, []);

  /** 상단 Search 검색 버튼 클릭 **/
  const searchHeaderViewSearchPress = useCallback(() => {
    if (searchText.length !== 0) {
      searchWordAndShowResult(searchText);
    }
  }, [searchText]);

  /**
   *  왼쪽 상단 검색버튼 눌렀을때의 동작 로직.
   *  0. text가 2개 이상일때만 검색 수행
   *  1. AsyncStorage에 현재 textInput의 값 저장.
   *  2. 현재 검색 단어(searchWordList) 가 6개 이상일경우 1개의 아이템을 제거함.
   *  3. 현재 입력 단어(currentWordView)를 열어서 현재 검색한 단어를 화면에 보여줌.
   *  4. 현재 검색 단어(searchWordList)를 화면에서 없애고, 검색 결과 성경(searchResultView)에 대한 쿼리 진행
   */
  const searchWordAndShowResult = useCallback(searchTextValue => {
    textInputRef.current.blur();
    textInputRef.current.clear();

    if (searchTextValue.length < 2) {
      toastRef.current.show('2자 이상으로 검색어를 입력해주세요 :)');
      return;
    }

    getItemFromAsyncStorage<any[]>(SEARCH_WORD_LIST).then(items => {
      let searchWordItems = items;
      if (searchWordItems === null) searchWordItems = [];

      searchWordItems.push(searchTextValue);
      const currentWordText = searchTextValue;

      // 5개가 넘어가면 searchWordItems(검색어 목록)에서 아이템 1개 삭제.
      if (searchWordItems.length > 5) {
        searchWordItems.shift();
      }
      setItemToAsyncStorage(SEARCH_WORD_LIST, searchWordItems).then(() => {
        setSearchWordItems(searchWordItems);
        setSearchText('');
        setCurrentWordText(currentWordText);
        setSearchTextEditable(false);
      });
    });

    /** getSearchResult **/
    getSqliteDatabase().transaction(tx => {
      const query = `SELECT book, chapter, verse, content from bible_korHRV WHERE content LIKE '%${searchTextValue}%' `;
      tx.executeSql(query, [], (tx, results) => {
        const searchResultItems = [];
        for (let i = 0; i < results.rows.length; i++) {
          const bookCode = results.rows.item(i).book;
          const bibleName = getBibleTypeString(bookCode);
          const bibleItems = bibleName === '구약' ? getOldBibleItems() : getNewBibleItems();
          const bookName = bibleItems.find((item, index) => {
            return item.bookCode === bookCode;
          }).bookName;
          const chapterCode = results.rows.item(i).chapter;
          const verseCode = results.rows.item(i).verse;
          const content = results.rows.item(i).content;

          searchResultItems.push({
            bibleName,
            bookName,
            bookCode,
            chapterCode,
            verseCode,
            content,
          });
        }

        setIsOpenSearchWordListView(false);
        setIsOpenSearchResultView(true);
        setSearchResultItems(searchResultItems);
      });
    });

    setIsOpenCurrentWordView(true);
    setSearchTextPlaceHolder('');
    setIsOpenSearchMode(true);
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
    (async () => {
      /** 검색했던 단어들에 대한 List를 Local DB에서 불러옴 **/
      let searchWordList = await getItemFromAsyncStorage<any[]>(SEARCH_WORD_LIST);
      if (searchWordList === null) {
        setSearchWordItems([]);
      } else {
        setSearchWordItems(searchWordList);
      }

      /** 최근 읽은 성경구절 정보를 LocalDB에서 가져옴 **/
      let latelyReadList = await getItemFromAsyncStorage<Record<string, any>>(LATELY_READ_LIST);
      if (latelyReadList === null) {
        setIsOpenLatelyReadBibleView(false);
      } else {
        /** 만약 최근 읽은 성경구절 정보가 있다면, 이어보기 화면을 출력 **/
        const { bibleName, bookName, bookCode, chapterCode } = latelyReadList;
        setLatelyReadItem({ bibleName, bookName, bookCode, chapterCode });
        setIsOpenLatelyReadBibleView(true);
      }

      /** 서버에서 오늘의 성경을 가져와 화면에 출력. **/
      const todayVerseDocument = await firestore().collection('todayVerse').doc('data').get();

      const { content, versePath } = todayVerseDocument.data();

      if (content && versePath) {
        setVerseSentence(content);
        setVerseString(versePath);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.contentContainer}>
        <SearchHeaderView
          searchHeaderViewTextFocus={searchHeaderViewTextFocus}
          searchHeaderViewTextOnChange={searchHeaderViewTextOnChange}
          searchHeaderViewCancelPress={searchHeaderViewCancelPress}
          searchHeaderViewSearchPress={searchHeaderViewSearchPress}
          searchTextEditable={searchTextEditable}
          searchTextPlaceHolder={searchTextPlaceHolder}
          textInputRef={textInputRef}
          searchHeaderViewTextBlur={searchHeaderViewTextBlur}
        />

        {!isOpenSearchMode && (
          <MainBibleView goToBookListScreen={goToBookListScreen} verseSentence={verseSentence} verseString={verseString} />
        )}

        {isOpenLatelyReadBibleView && !isOpenSearchMode && (
          <LatelyReadBibleView goToLatestReadScreen={goToLatestReadScreen} latelyReadItem={latelyReadItem} />
        )}

        {isOpenSearchResultView && <SearchResultView searchResultItems={searchResultItems} moveToBibleChapter={moveToBibleChapter} />}
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
