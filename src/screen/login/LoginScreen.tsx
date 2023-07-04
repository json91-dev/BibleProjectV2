import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, Text, Image } from 'react-native';

import GoogleLoginButton from '../../components/login/GoogleLoginButton';
import auth from '@react-native-firebase/auth';
// import { getItemFromAsyncStorage } from '../utils';
// import { APPLE_ID_TOKEN, GOOGLE_ID_TOKEN } from '../constraints';
// import AppleLoginButton from '../components/login/AppleLoginButton';
const LoginScreen = ({ navigation }) => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // // 자동 로그인을 수행함.
  // const checkAutoLogin = useCallback(async () => {
  //   const googleIdToken = await getItemFromAsyncStorage<string | null>(GOOGLE_ID_TOKEN);
  //   if (googleIdToken) {
  //     navigation.replace('Main');
  //     return;
  //   }
  //
  //   const appleIdToken = await getItemFromAsyncStorage<string | null>(APPLE_ID_TOKEN);
  //   if (appleIdToken) {
  //     navigation.replace('Main');
  //     return;
  //   }
  // }, []);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        // 사용자가 이전에 로그인한 상태인 경우
        // 자동 로그인 처리 로직 수행
        console.log('자동 로그인: ', user.uid);
        setIsAuthenticated(true);
      } else {
        // 사용자가 이전에 로그인하지 않은 상태인 경우
        // 로그인 페이지로 이동 등 필요한 로직 수행
        setIsAuthenticated(false);
      }
    });

    // 구독 취소 (컴포넌트가 언마운트될 때 실행)
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('페이지 이동');
      navigation.replace('MainTabNavigator');
    }
  }, [isAuthenticated]);

  return (
    <LinearGradient colors={['#F9DA4F', '#F7884F']} style={styles.linearGradient}>
      <View>
        <Image source={require('../../assets/ic_thecross.png')} style={styles.icon} />
        <Text style={styles.titleText}>THE BIBLE</Text>
        <Text style={styles.titleInfo}>로그인해서 성경공부를 해보세요.</Text>
      </View>

      <GoogleLoginButton navigation={navigation} setErrorMessage={setErrorMessage} />
      {/*<AppleLoginButton navigation={navigation} setErrorMessage={setErrorMessage} />*/}

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
