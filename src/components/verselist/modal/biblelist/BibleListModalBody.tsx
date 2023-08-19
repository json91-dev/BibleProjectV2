import React, { useCallback, useState } from 'react';
import BookListComponent from './BookListComponent';
import ChapterListComponent from './ChapterListComponent';
import VerseListComponent from './VerseListComponent';
import { StackActions } from '@react-navigation/native';
import { BOOK_LIST_PAGE, CHAPTER_LIST_PAGE, VERSE_LIST_PAGE } from './BibleListModal';

const BibleListModalBody = ({ pageStack, setPageStack, setHeaderTitle, bibleType, navigation }) => {
  const [bookInfo, setBookInfo] = useState<any>({});

  const changePage = useCallback(
    (_pageStack, bookName, bookCode, chapterCode) => () => {
      let headerTitle;
      if (_pageStack === CHAPTER_LIST_PAGE) {
        headerTitle = bookName;
      } else if (_pageStack === VERSE_LIST_PAGE) {
        headerTitle = `${bookName} ${chapterCode}장`;
      }

      setPageStack(_pageStack);
      setHeaderTitle(headerTitle);
      setBookInfo({ bookName, bookCode, chapterCode });
    },
    [pageStack, bookInfo],
  );

  const changeScreenTargetVerse = useCallback(
    (bookName, bookCode, chapterCode) => {
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
    },
    [bookInfo, navigation],
  );

  switch (pageStack) {
    case BOOK_LIST_PAGE: {
      return <BookListComponent bibleType={bibleType} changePage={changePage} />;
    }

    case CHAPTER_LIST_PAGE: {
      return <ChapterListComponent changePage={changePage} bookName={bookInfo.bookName} bookCode={bookInfo.bookCode} />;
    }

    case VERSE_LIST_PAGE: {
      return (
        <VerseListComponent
          changeScreenTargetVerse={changeScreenTargetVerse}
          bookName={bookInfo.bookName}
          bookCode={bookInfo.bookCode}
          chapterCode={bookInfo.chapterCode}
        />
      );
    }
  }
};

export default BibleListModalBody;
