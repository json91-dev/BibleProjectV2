import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight, SafeAreaView, FlatList } from 'react-native';

import AdmobBannerBottom from '../../components/common/AdmobBannerBottom';
import { getOldBibleItems, getNewBibleItems } from '../../utils';

const BookListScreen = props => {
  const { route, navigation } = props;

  const oldBibleItems = getOldBibleItems();
  const newBibleItems = getNewBibleItems();

  console.log(route.params);

  const item = route.params.bibleType === 0 ? oldBibleItems : newBibleItems;
  const activeItemColor = route.params.bibleType === 0 ? '#F9DA4F' : '#F8924F';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gridView}>
        <FlatList
          data={item}
          numColumns={4}
          renderItem={({ item }) => (
            <TouchableHighlight
              style={[styles.itemContainer, { backgroundColor: '#F3F4F9' }]}
              activeOpacity={0.8}
              underlayColor={activeItemColor}
              onPress={() =>
                navigation.navigate('ChapterListScreen', {
                  bookName: item.bookName,
                  bookCode: item.bookCode,
                })
              }>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCode}>{item.bookName}</Text>
              </View>
            </TouchableHighlight>
          )}
        />
      </View>

      <View style={styles.bannerView}>
        <AdmobBannerBottom />
      </View>
    </SafeAreaView>
  );
};

export default BookListScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },

  gridView: {
    backgroundColor: 'white',
    height: '90%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  itemContainer: {
    justifyContent: 'center',
    borderRadius: 5,
    width: 70,
    aspectRatio: 1,
    margin: 7,
  },

  itemName: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: 'black',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 5,
  },
  banner: {
    borderWidth: 1,
    height: '10%',
    width: '100%',
  },

  bannerView: {
    height: '10%',
    width: '100%',
  },
});
