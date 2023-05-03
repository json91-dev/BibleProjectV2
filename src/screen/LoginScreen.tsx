import React, { useCallback, useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

import { getItemFromAsync, setItemToAsync } from '../utils';
const LoginScreen = ({ navigation }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const goToMainBible = useCallback(() => {
    navigation.replace('Main');
  }, []);

  const googleSignIn = useCallback(async () => {
    try {
      /** 로그인 성공시 Storage에 유저 정보 저장 **/

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      await setItemToAsync('userInfo', { ...userInfo, loggedIn: true });
      goToMainBible();
    } catch (error) {
      /** 에러 핸들링 : https://www.npmjs.com/package/@react-native-google-signin/google-signin 참고 */
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
      } // some other error happened
      setErrorMessage(error.message);
    }
  }, []);

  const googleSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      const userInfo = await getItemFromAsync<Record<string, any>>('userInfo');

      await setItemToAsync('userInfo', {
        ...userInfo,
        loggedIn: false,
      });
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

    /** localStorage에서 로그인 정보를 읽은 뒤, 자동 로그인을 수행함. **/
    getItemFromAsync<Record<string, any>>('userInfo').then(userInfo => {
      // 유저 정보가 없는경우
      if (userInfo === null) {
        return null;
      }
      // 유저 정보가 있고, 유저가 로그인 되어있는 경우
      else if (userInfo && userInfo.loggedIn) {
        goToMainBible();
        return null;
      }
      // 유저 정보가 있고 유저가 로그인 되어있지 않은 경우
      else if (userInfo && !userInfo.loggedIn) {
        return null;
      }
    });
  }, []);

  return (
    <LinearGradient colors={['#F9DA4F', '#F7884F']} style={styles.linearGradient}>
      <View>
        <Image source={require('../assets/ic_thecross.png')} style={styles.icon} />
        <Text style={styles.titleText}>THE BIBLE</Text>
        <Text style={styles.titleInfo}>로그인해서 성경공부를 해보세요.</Text>
      </View>
      <TouchableOpacity style={styles.googleLoginButtonContainer} onPress={googleSignIn}>
        <Image style={styles.googleLoginButton} source={require('../assets/btn_google_login.png')} />
      </TouchableOpacity>

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

  googleLoginButtonContainer: {
    marginTop: 10,
  },

  googleLoginButton: {
    width: 250,
    height: 50,
    resizeMode: 'contain',
  },
});
