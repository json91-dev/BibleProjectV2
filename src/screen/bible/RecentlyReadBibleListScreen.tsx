import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useEffect } from 'react';
// import { getItemFromAsyncStorage } from '../../utils';
// import { RECENTLY_READ_BIBLE_LIST } from '../../constraints';

const RecentlyReadBibleListScreen = () => {
  useEffect(() => {
    // const data = await getItemFromAsyncStorage(RECENTLY_READ_BIBLE_LIST);
  }, []);

  return <SafeAreaView style={styles.container}></SafeAreaView>;
};

export default RecentlyReadBibleListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'black',
  },
});
