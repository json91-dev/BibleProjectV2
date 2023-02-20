import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

const MainBibleView = props => {
  const {goToBookListScreen, verseSentence, verseString} = props;

  return (
    <>
      <View style={styles.mainView}>
        <Image
          style={styles.todayImage}
          source={require('../../assets/ic_today_title.png')}
        />
        <Text style={styles.todayWord}>{verseSentence}</Text>
        <Text style={styles.todayWordDetail}>{verseString}</Text>
        <Text style={styles.linkLabel}>성경책 읽기</Text>
        <TouchableOpacity
          style={styles.bibleLink}
          onPress={() => goToBookListScreen(0)}>
          <Image
            style={styles.bibleLinkImage}
            source={require('../../assets/btn_old_bible.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bibleLink}
          onPress={() => goToBookListScreen(1)}>
          <Image
            style={styles.bibleLinkImage}
            source={require('../../assets/btn_new_bible.png')}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default MainBibleView;

const styles = StyleSheet.create({
  mainView: {
    height: '82%',
    marginBottom: '6%',
    marginTop: 60,
  },

  todayImage: {
    marginTop: '3%',
    marginLeft: 36,
    aspectRatio: 2,
    height: '10%',
    resizeMode: 'contain',
  },

  todayWord: {
    paddingLeft: 36,
    paddingRight: 36,
    marginTop: '5%',
    fontSize: 18,
  },

  todayWordDetail: {
    textAlign: 'right',
    paddingTop: 34,
    paddingRight: 36,
    color: '#828282',
  },

  linkLabel: {
    paddingLeft: 36,
    marginTop: '10%',
    marginBottom: '6%',
  },

  bibleLink: {
    marginBottom: 20,
    height: '20%',
    width: '100%',
  },

  bibleLinkImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
