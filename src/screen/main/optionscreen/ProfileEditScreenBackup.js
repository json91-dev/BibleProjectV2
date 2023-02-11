import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  Alert,
  Button,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {getItemFromAsync, setItemToAsync} from '../../../utils';
import Toast from 'react-native-easy-toast';
import {StackActions} from '@react-navigation/native';

export default class ContentScreen extends Component {
  state = {
    profilePic: null,
    isImageAvailable: false,
    textInput: '',
  };

  _getProfile = async () => {
    const profilePic = await getItemFromAsync('profilePic');
    const profileNick = await getItemFromAsync('profileNick');

    if (profilePic && profileNick) {
      // 프로필 사진이 localStorage에 저장되어 있을 때 해당 값을 읽어옴.
      this.setState({
        isImageAvailable: true,
        profilePic: profilePic,
        textInput: profileNick,
      });
    } else if (profileNick) {
      this.setState({
        isImageAvailable: false,
        textInput: profileNick,
      });
    } else {
      // 프로필 사진이 localStorage에 저장되지 않았을 때,
      this.setState({
        isImageAvailable: false,
      });
    }
  };

  componentDidMount() {
    this._getProfile();
  }

  getProfileImage = () => {
    const options = {
      title: 'Select Avatar',
      customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
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
        const source = {uri: response.uri};

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          profilePic: source,
          isImageAvailable: true,
        });
        console.log('프로필 이미지 uri localStorage에 저장');
      }
    });
  };

  goToBackScreen = () => {
    const navigation = this.props.navigation;
    const popAction = StackActions.pop(1);
    navigation.dispatch(popAction);
  };

  // 프로필 수정 수행 완료시 수행됨
  // 닉네임과 프로필 사진에 대한 url을 저장하고 Toast메세지를 날려준다.
  // 프로필 사진이 없어도 닉네임은 바꿀수 있지만 닉네임이 없으면 프로필 정보 변경은 할 수 없음.
  completeProfileEdit = () => {
    const {profilePic} = this.state;
    const nickname = this.state.textInput;
    if (nickname.length === 0) {
      console.log('닉네임을 입력하지 않음.');
      this.refs.toast.show('닉네임을 한글자 이상 입력해주세요 ^^');
      return;
    }

    const _saveProfileInfo = async () => {
      try {
        if (profilePic !== null) {
          await setItemToAsync('profilePic', profilePic);
          await setItemToAsync('profileNick', nickname);
          console.log('프로필사진, 닉네임 저장 완료');
          this.goToBackScreen();
        } else {
          await setItemToAsync('profileNick', nickname);
          this.goToBackScreen();
        }
      } catch (err) {
        console.log(err);
      }
    };
    _saveProfileInfo();
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.isImageAvailable ? (
          <Image style={styles.nicknameImage} source={this.state.profilePic} />
        ) : (
          <Image
            style={styles.nicknameImage}
            source={require('assets/ic_jesus_nickname.png')}
          />
        )}
        <TouchableOpacity
          onPress={this.getProfileImage}
          style={styles.profilePhotoButton}>
          <Text style={styles.profilePhotoButtonText}>프로필 사진 변경</Text>
        </TouchableOpacity>

        <Text style={styles.nicknameLabel}>닉네임을 입력하세요.</Text>
        <TextInput
          editable
          maxLength={10}
          placeholder="프로필 입력"
          style={styles.nickname}
          value={this.state.textInput}
          onChangeText={text => this.setState({textInput: text})}
        />

        <TouchableOpacity
          style={styles.editButton}
          onPress={this.completeProfileEdit}
          onFocus={() => {}}
          onBlur={() => {}}>
          <Text style={styles.editButtonText}>프로필 수정 완료</Text>
        </TouchableOpacity>

        <Toast
          ref="toast"
          positionValue={200}
          fadeInDuration={200}
          fadeOutDuration={600}
        />
      </View>
    );
  }
}

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
