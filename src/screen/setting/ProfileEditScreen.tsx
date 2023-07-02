import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import ImagePicker from 'react-native-image-picker/lib/commonjs';
import { getItemFromAsyncStorage, setItemToAsyncStorage } from '../../utils';
import Toast from 'react-native-easy-toast';
import { StackActions } from '@react-navigation/native';
import { PROFILE_NICK, PROFILE_PIC } from '../../constraints';

const ProfileEditScreen = props => {
  const { navigation } = props;
  const [profilePic, setProfilePic] = useState(null);
  const [profileNickText, setProfileNickText] = useState('');
  const [isImageAvailable, setIsImageAvailable] = useState(false);
  const toastRef = useRef(null);

  const getProfileFromLocalStorage = useCallback(async () => {
    const profilePicSource = await getItemFromAsyncStorage<any>(PROFILE_PIC);
    const profileNickSource = await getItemFromAsyncStorage<any>(PROFILE_NICK);

    if (profilePic) {
      setProfilePic(profilePicSource);
      setIsImageAvailable(true);
    } else {
      setIsImageAvailable(false);
    }

    if (typeof profileNickSource === 'string') {
      setProfileNickText(profileNickSource);
    }
  }, [profilePic]);

  const saveProfileImageByGallery = useCallback(() => {
    const options = {
      title: 'Select Avatar',
      customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        setProfilePic(source);
        setIsImageAvailable(true);
      }
    });
  }, []);

  const completeProfileEdit = useCallback(async () => {
    try {
      if (profileNickText.length === 0) {
        toastRef.current.show('닉네임을 한글자 이상 입력해주세요 ^^');
        return null;
      }

      if (profilePic !== null) {
        await setItemToAsyncStorage(PROFILE_PIC, profilePic);
        await setItemToAsyncStorage(PROFILE_NICK, profileNickText);
      } else {
        await setItemToAsyncStorage(PROFILE_NICK, profileNickText);
      }

      const popAction = StackActions.pop(1);
      navigation.dispatch(popAction);
    } catch (err) {
      console.log(err);
    }
  }, [navigation, profileNickText, profilePic]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getProfileFromLocalStorage().then();
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, getProfileFromLocalStorage]);

  return (
    <View style={styles.container}>
      {isImageAvailable ? (
        <Image style={styles.nicknameImage} source={profilePic} />
      ) : (
        <Image style={styles.nicknameImage} source={require('../../assets/ic_jesus_nickname.png')} />
      )}
      <TouchableOpacity onPress={saveProfileImageByGallery} style={styles.profilePhotoButton}>
        <Text style={styles.profilePhotoButtonText}>프로필 사진 변경</Text>
      </TouchableOpacity>

      <Text style={styles.nicknameLabel}>닉네임을 입력하세요.</Text>
      <TextInput
        editable
        maxLength={10}
        placeholder="프로필 입력"
        style={styles.nickname}
        value={profileNickText}
        onChangeText={text => setProfileNickText(text)}
      />

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          completeProfileEdit().then();
        }}
        onFocus={() => {}}
        onBlur={() => {}}>
        <Text style={styles.editButtonText}>프로필 수정 완료</Text>
      </TouchableOpacity>

      <Toast ref={toastRef} positionValue={200} fadeInDuration={200} fadeOutDuration={600} />
    </View>
  );
};

export default ProfileEditScreen;

const styles = StyleSheet.create({
  container: {
    paddingLeft: '6%',
    paddingRight: '6%',
    backgroundColor: 'white',
    height: '100%',
  },
  nicknameImage: {
    marginTop: 35,
    width: 110,
    height: 110,
    resizeMode: 'cover',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 200,
  },
  profilePhotoButton: {
    borderWidth: 1,
    borderRadius: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 30,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 8,
    paddingRight: 8,
    marginBottom: 22,
    borderColor: '#828282',
  },

  profilePhotoButtonText: {
    color: '#828282',
    fontSize: 12,
  },

  nicknameLabel: {
    color: '#828282',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 14,
  },

  nickname: {
    borderBottomWidth: 1,
    borderColor: '#EDEDED',
    marginTop: 25,
    paddingBottom: 23,
    fontSize: 22,
    textAlign: 'center',
  },

  editButton: {
    marginTop: 31,
    backgroundColor: '#F6D43F',
    height: 50,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  editButtonText: {
    fontWeight: 'bold',
  },
});
