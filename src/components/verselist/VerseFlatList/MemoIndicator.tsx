import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

const memoIndicator = ({item, verseItemFontSize}) => {
  // indicator 이미지의 위치를 폰트 사이즈에 따라 상대적으로 마진값 조절.
  const indicatorMarginTop = (verseItemFontSize - 14) / 2;

  if (item.isMemo) {
    return (
      <Image
        style={[styles.memoIndicator, {marginTop: indicatorMarginTop}]}
        source={require('../../../assets/ic_memo_indicator.png')}
      />
    );
  } else {
    return <View style={{width: '4%'}}></View>;
  }
};

export default memoIndicator;

const styles = StyleSheet.create({
  memoIndicator: {
    width: '4%',
    height: 19,
    resizeMode: 'contain',
    borderColor: 'red',
  },
});
