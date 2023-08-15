import React, { useCallback, useEffect, useRef, useState } from 'react';
import { fetchDataFromSqlite, getItemFromAsyncStorage, setItemToAsyncStorage } from '../../utils';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import Toast from 'react-native-easy-toast';
import firestore from '@react-native-firebase/firestore';
import MainBibleView from '../../components/biblemain/MainBibleView';
import { getBibleTypeString, getOldBibleItems, getNewBibleItems } from '../../utils';
import { StackActions } from '@react-navigation/native';
import RecentlyReadBibleView from '../../components/biblemain/RecentlyReadBibleView';
import SearchHeaderView from '../../components/biblemain/SearchHeaderView';
import SearchResultView from '../../components/biblemain/SearchResultView';
import { SEARCH_WORD_LIST } from '../../constraints';
import SearchWordListView from '../../components/biblemain/SearchWordListView';

const BibleMainScreen = props => {
  const [isShowMainBibleView, setIsShowMainBibleView] = useState(true);
  const [isShowSearchResultView, setIsShowSearchResultView] = useState(false);
  const [searchWordItems, setSearchWordItems] = useState([]);
  const [textInputPlaceHolder, setTextInputPlaceHolder] = useState('다시 읽고 싶은 말씀이 있나요?');
  const [searchResultItems, setSearchResultItems] = useState([]);
  const [verseSentence, setVerseSentence] = useState('');
  const [verseString, setVerseString] = useState('');
  const textInputRef = useRef(null);
  const toastRef = useRef(null);

  const textInputFocus = useCallback(() => {
    setIsShowMainBibleView(false);
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

    setIsShowSearchResultView(true);
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
      await initTodayVerseFromFirebase();
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
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
            <MainBibleView verseSentence={verseSentence} verseString={verseString} />
            <RecentlyReadBibleView />
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
