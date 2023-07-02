import appleAuth, { AppleRequestOperation, AppleRequestScope } from '@invertase/react-native-apple-authentication';
import React, { useCallback } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { setItemToAsyncStorage } from '../../utils';
import { APPLE_ID_TOKEN } from '../../constraints';

const AppleLoginButton = ({ navigation, setErrorMessage }) => {
  const appleSignIn = useCallback(async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleRequestOperation.LOGIN,
        requestedScopes: [AppleRequestScope.EMAIL, AppleRequestScope.FULL_NAME],
      });

      const idToken = appleAuthRequestResponse.identityToken;
      await setItemToAsyncStorage(APPLE_ID_TOKEN, idToken);
      navigation.replace('MainTabNavigator');
    } catch (error) {
      console.log('애플 로그인 실패', error);
      setErrorMessage(error.message);
    }
  }, []);

  return (
    <TouchableOpacity style={styles.appleLoginButtonContainer} onPress={appleSignIn}>
      <Image style={styles.appleLoginButton} source={require('../assets/btn_apple_login.png')} />
    </TouchableOpacity>
  );
};

export default AppleLoginButton;

const styles = StyleSheet.create({
  appleLoginButtonContainer: {
    marginTop: 10,
  },

  appleLoginButton: {
    width: 250,
    height: 50,
    resizeMode: 'contain',
  },
});
