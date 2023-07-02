import React, {Component} from 'react';

import {StyleSheet, View, Text} from 'react-native';

const PrivacyScreen = () => {
  return (
    <View>
      <Text>My Name is Privacy</Text>
    </View>
  );
};

export default PrivacyScreen;

const styles = StyleSheet.create({
  container: {
    paddingLeft: '3%',
    paddingRight: '3%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
