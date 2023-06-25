import React, { useCallback, useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, Text, Image } from 'react-native';

import GoogleLoginButton from '../components/login/GoogleLoginButton';
import { getItemFromAsyncStorage } from '../utils';
import { APPLE_ID_TOKEN, GOOGLE_ID_TOKEN } from '../constraints';
import AppleLoginButton from '../components/login/AppleLoginButton';
const LoginScreen = ({ navigation }) => {
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 자동 로그인을 수행함.
  const checkAutoLogin = useCallback(async () => {
    const googleIdToken = await getItemFromAsyncStorage<string | null>(GOOGLE_ID_TOKEN);
    if (googleIdToken) {
      navigation.replace('Main');
      return;
    }

    const appleIdToken = await getItemFromAsyncStorage<string | null>(APPLE_ID_TOKEN);
    if (appleIdToken) {
      navigation.replace('Main');
      return;
    }
  }, []);

  useEffect(() => {
    checkAutoLogin().then();
  }, []);

  return (
    <LinearGradient colors={['#F9DA4F', '#F7884F']} style={styles.linearGradient}>
      <View>
        <Image source={require('../assets/ic_thecross.png')} style={styles.icon} />
        <Text style={styles.titleText}>THE BIBLE</Text>
        <Text style={styles.titleInfo}>로그인해서 성경공부를 해보세요.</Text>
      </View>

      <GoogleLoginButton navigation={navigation} setErrorMessage={setErrorMessage} />
      <AppleLoginButton navigation={navigation} setErrorMessage={setErrorMessage} />

      {errorMessage !== '' && <Text>{errorMessage}</Text>}
    </LinearGradient>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  icon: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  titleText: {
    fontWeight: 'normal',
    fontSize: 24,
    textAlign: 'center',
    margin: 20,
    color: 'white',
  },
  titleInfo: {
    fontSize: 14,
    textAlign: 'center',
    margin: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  loginButton: {},
});
