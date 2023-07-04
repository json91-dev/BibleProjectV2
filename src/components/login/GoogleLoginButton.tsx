import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { GoogleSignin } from '@react-native-community/google-signin';
import { removeItemFromAsyncStorage, setItemToAsyncStorage } from '../../utils';
import { FIREBASE_USER_CREDENTIAL, GOOGLE_ID_TOKEN } from '../../constraints';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const GoogleLoginButton = ({ navigation, setErrorMessage }) => {
  const googleSignIn = useCallback(async () => {
    // 구글 계정으로 로그인
    const signInWithGoogle = async () => {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      return googleCredential;
    };

    // 로그인 후 정보 firestore 저장
    const saveUserDateInfoFirestore = async currentUser => {
      const { uid, displayName, email, photoURL } = currentUser;
      firestore()
        .collection('users')
        .doc(uid)
        .set({
          displayName,
          email,
          photoURL,
        })
        .then(() => {
          console.log('User information saved to DB');
        })
        .catch(error => {
          console.log('Error saving user information:', error);
        });
    };

    try {
      const googleCredential = await signInWithGoogle();
      console.log(googleCredential);
      await setItemToAsyncStorage(FIREBASE_USER_CREDENTIAL, googleCredential);
      const currentUser = auth().currentUser;
      console.log(currentUser);
      await saveUserDateInfoFirestore(currentUser);
      navigation.replace('MainTabNavigator');
    } catch (error) {
      console.error('구글 로그인 실패', error);
      setErrorMessage(error.message);
    }
  }, []);

  useEffect(() => {
    /** 구글 로그인 초기 설정 **/
    GoogleSignin.configure({
      webClientId: '271807854923-f0si6s5dj9urd45nvdpqpeihnc3q8i57.apps.googleusercontent.com',
      offlineAccess: false,
    });
  });

  return (
    <TouchableOpacity style={styles.googleLoginButtonContainer} onPress={googleSignIn}>
      <Image style={styles.googleLoginButton} source={require('../../assets/btn_google_login.png')} />
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
