import React from 'react';
import {StyleSheet, Image, View, Text} from 'react-native';

const CopyrightScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.Image}
        source={require('../../../assets/ic_bible_copyright.png')}
      />
      <Text style={styles.Text}>
        더바이블의 성경에 대한 저작권은{'\n'}'대한성서협회'에 있으며,{'\n'}무단
        복제시 처벌될수 있습니다.
      </Text>
    </View>
  );
};

export default CopyrightScreen;

const styles = StyleSheet.create({
  container: {
    paddingLeft: '6%',
    paddingRight: '6%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100%',

    paddingBottom: '20%',
  },

  Image: {
    resizeMode: 'contain',
    width: '50%',
    height: '50%',
  },

  Text: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 30,
  },
});
