import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import BibleListModalHeader from './BibleListModalHeader';
import BibleListModalBody from './BibleListModalBody';

export const BOOK_LIST_PAGE = 0;
export const CHAPTER_LIST_PAGE = 1;
export const VERSE_LIST_PAGE = 2;

const BibleListModal = ({ closeHandler, navigation, bibleType }) => {
  const [pageStack, setPageStack] = useState(BOOK_LIST_PAGE);
  const [headerTitle, setHeaderTitle] = useState(null);

  return (
    <View style={styles.container}>
      <BibleListModalHeader
        setHeaderTitle={setHeaderTitle}
        setPageStack={setPageStack}
        pageStack={pageStack}
        closeModal={closeHandler}
        headerTitle={headerTitle}
      />
      <BibleListModalBody
        setHeaderTitle={setHeaderTitle}
        setPageStack={setPageStack}
        pageStack={pageStack}
        bibleType={bibleType}
        navigation={navigation}
      />
    </View>
  );
};

export default BibleListModal;

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
