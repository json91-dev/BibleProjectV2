import React from 'react';
import {StyleSheet, Text} from 'react-native';

const HighlightText = ({item, verseItemFontSize, verseItemFontFamily}) => {
  if (item.isHighlight) {
    return (
      <Text
        style={[
          styles.flatListItemTextHighlight,
          {fontSize: verseItemFontSize, fontFamily: verseItemFontFamily},
        ]}>
        {item.content}
      </Text>
    );
  } else {
    return (
      <Text
        style={[
          styles.flatListItemText,
          {fontSize: verseItemFontSize, fontFamily: verseItemFontFamily},
        ]}>
        {item.content}
      </Text>
    );
  }
};

export default HighlightText;

const styles = StyleSheet.create({
  flatListItemText: {
    width: '86%',
    color: 'black',
    marginRight: '3%',
    paddingRight: 5,
    marginLeft: 5,
  },

  flatListItemTextHighlight: {
    width: '86%',
    color: 'black',
    marginRight: '3%',
    paddingRight: 5,
    marginLeft: 5,
    textShadowColor: 'yellow',
    textShadowRadius: 15,
  },
});
