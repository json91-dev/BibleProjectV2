import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import BibleListOptionHeader from './BibleListOptionHeader';
import BibleListOptionBody from './BibleListOptionBody';

export const BOOK_LIST_PAGE = 0;
export const CHAPTER_LIST_PAGE = 1;
export const VERSE_LIST_PAGE = 2;

const BibleListOption = ({ closeHandler, navigation, bibleType }) => {
  const [pageStack, setPageStack] = useState(BOOK_LIST_PAGE);
  const [headerTitle, setHeaderTitle] = useState(null);

  return (
    <View style={styles.container}>
      <BibleListOptionHeader
        setHeaderTitle={setHeaderTitle}
        setPageStack={setPageStack}
        pageStack={pageStack}
        closeModal={closeHandler}
        headerTitle={headerTitle}
      />
      <BibleListOptionBody
        setHeaderTitle={setHeaderTitle}
        setPageStack={setPageStack}
        pageStack={pageStack}
        bibleType={bibleType}
        navigation={navigation}
      />
    </View>
  );
};

export default BibleListOption;

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
});
