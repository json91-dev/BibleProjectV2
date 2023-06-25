import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { GoogleSignin } from '@react-native-community/google-signin';
import { removeItemFromAsyncStorage, setItemToAsyncStorage } from '../../utils';
import { GOOGLE_ID_TOKEN } from '../../constraints';

const GoogleLoginButton = ({ navigation, setErrorMessage }) => {
  const googleSignIn = useCallback(async () => {
    try {
      /** 로그인 성공시 Storage에 유저 정보 저장 **/
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      await setItemToAsyncStorage(GOOGLE_ID_TOKEN, idToken);
      navigation.replace('Main');
    } catch (error) {
      console.error('구글 로그인 실패', error);
      setErrorMessage(error.message);
    }
  }, []);

  const googleSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await removeItemFromAsyncStorage(GOOGLE_ID_TOKEN);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    /** 구글 로그인 초기 설정 **/
    GoogleSignin.configure({
      webClientId: '271807854923-f0si6s5dj9urd45nvdpqpeihnc3q8i57.apps.googleusercontent.com',
      offlineAccess: false,
    });
  });

  return (
    <TouchableOpacity style={styles.googleLoginButtonContainer} onPress={googleSignIn}>
      <Image style={styles.googleLoginButton} source={require('../assets/btn_google_login.png')} />
    </TouchableOpacity>
  );
};

export default GoogleLoginButton;

const styles = StyleSheet.create({
  googleLoginButtonContainer: {
    marginTop: 10,
  },

  googleLoginButton: {
    width: 250,
    height: 50,
    resizeMode: 'contain',
  },
});
