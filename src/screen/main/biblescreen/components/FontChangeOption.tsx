import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

import {getItemFromAsync, setItemToAsync} from '../../../../utils';

export default class FontChangeOption extends Component {
  state = {
    isOpenAnswer: false,
    fontSize: '14px',
    fontSizeOption: null,
    fontFamilyOption: null,
  };

  componentDidMount() {
    // 로컬 스토리지로부터 폰트 사이즈를 가져옵니다.
    getItemFromAsync('fontSizeOption').then(item => {
      if (item === null) {
        // 기본 폰트 사이즈 16px
        this.setState({
          fontSizeOption: 1,
        });
      } else {
        this.setState({
          fontSizeOption: item,
        });
      }
    });

    // 로컬 스토리지로부터 폰트 패밀리를 가져옵니다.
    getItemFromAsync('fontFamilyOption').then(item => {
      if (item === null) {
        this.setState({
          fontFamilyOption: 0,
        });
      } else {
        this.setState({
          fontFamilyOption: item,
        });
      }
    });
  }

  //////////////////////////// 컴포넌트 ///////////////////////////////////

  // 폰트패밀리 변경 버튼 컴포넌트
  // 0: 기본
  // 1: 맑은체 NanumBrushScript-Regular.ttf
  // 2: 명조체 TmonMonsori.ttf
  // 3: 기린체 applemyungjo-regular.ttf
  FontFamilyButtonComponent = () => {
    const onChangeFontFamily = option => () => {
      const {changeFontFamilyHandler} = this.props;

      switch (option) {
        case 0:
          changeFontFamilyHandler('system font');
          break;
        case 1:
          changeFontFamilyHandler('NanumBrush');
          break;
        case 2:
          changeFontFamilyHandler('TmonMonsoriBlack');
          break;
        case 3:
          changeFontFamilyHandler('KoreanGIR-L');
          break;
      }
      this.setState({
        fontFamilyOption: option,
      });

      setItemToAsync('fontFamilyOption', option);
    };

    const FontFamilyButtonNormal = () => {
      const {fontFamilyOption} = this.state;

      if (fontFamilyOption === 0) {
        return (
          <TouchableOpacity
            style={styles.fontButtonChecked}
            onPress={onChangeFontFamily(0)}>
            <Text style={{fontSize: 12}}>기본</Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            style={styles.fontButton}
            onPress={onChangeFontFamily(0)}>
            <Text style={{fontSize: 12}}>기본</Text>
          </TouchableOpacity>
        );
      }
    };

    // 맑은체
    const FontFamilyButtonBrush = () => {
      const {fontFamilyOption} = this.state;

      if (fontFamilyOption === 1) {
        return (
          <TouchableOpacity
            style={styles.fontButtonChecked}
            onPress={onChangeFontFamily(1)}>
            <Text style={{fontSize: 12}}>맑은체</Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            style={styles.fontButton}
            onPress={onChangeFontFamily(1)}>
            <Text style={{fontSize: 12}}>맑은체</Text>
          </TouchableOpacity>
        );
      }
    };

    // 명조체
    const FontFamilyButtonTmon = () => {
      const {fontFamilyOption} = this.state;

      if (fontFamilyOption === 2) {
        return (
          <TouchableOpacity
            style={styles.fontButtonChecked}
            onPress={onChangeFontFamily(2)}>
            <Text style={{fontSize: 12}}>명조체</Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            style={styles.fontButton}
            onPress={onChangeFontFamily(2)}>
            <Text style={{fontSize: 12}}>명조체</Text>
          </TouchableOpacity>
        );
      }
    };

    // 기린체
    const FontFamilyButtonApple = () => {
      const {fontFamilyOption} = this.state;

      if (fontFamilyOption === 3) {
        return (
          <TouchableOpacity
            style={styles.fontButtonChecked}
            onPress={onChangeFontFamily(3)}>
            <Text style={{fontSize: 12}}>기린체</Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            style={styles.fontButton}
            onPress={onChangeFontFamily(3)}>
            <Text style={{fontSize: 12}}>기린체</Text>
          </TouchableOpacity>
        );
      }
    };

    return (
      <View style={styles.fontButtonContainer}>
        {FontFamilyButtonNormal()}
        {FontFamilyButtonBrush()}
        {FontFamilyButtonTmon()}
        {FontFamilyButtonApple()}
      </View>
    );
  };

  // 폰트사이즈 변경 버튼 컴포넌트
  FontSizeButtonComponent = () => {
    // 0: 12pt
    // 1: 14pt
    // 2: 16px
    // 3: 18pt
    // 폰트변경 버튼이 눌렸을시 폰트사이즈를 바꿔줍니다.
    // 부모 컴포넌트인 VerseListScreen으로 부터 changeFontHandler를 넘겨받아 바뀔 폰트 사이즈를 전달.
    const onChangeFontSize = option => () => {
      const {changeFontSizeHandler} = this.props;

      switch (option) {
        case 0:
          changeFontSizeHandler(12);
          break;
        case 1:
          changeFontSizeHandler(14);
          break;
        case 2:
          changeFontSizeHandler(16);
          break;
        case 3:
          changeFontSizeHandler(18);
          break;
      }
      this.setState({
        fontSizeOption: option,
      });

      setItemToAsync('fontSizeOption', option);
    };

    const FontSizeButton12 = () => {
      const {fontSizeOption} = this.state;

      if (fontSizeOption === 0) {
        return (
          <TouchableOpacity
            style={styles.fontButtonChecked}
            onPress={onChangeFontSize(0)}>
            <Text style={{fontSize: 12}}>12pt</Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            style={styles.fontButton}
            onPress={onChangeFontSize(0)}>
            <Text style={{fontSize: 12}}>12pt</Text>
          </TouchableOpacity>
        );
      }
    };

    const FontSizeButton14 = () => {
      const {fontSizeOption} = this.state;

      if (fontSizeOption === 1) {
        return (
          <TouchableOpacity
            style={styles.fontButtonChecked}
            onPress={onChangeFontSize(1)}>
            <Text style={{fontSize: 14}}>14pt</Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            style={styles.fontButton}
            onPress={onChangeFontSize(1)}>
            <Text style={{fontSize: 14}}>14pt</Text>
          </TouchableOpacity>
        );
      }
    };

    const FontSizeButton16 = () => {
      const {fontSizeOption} = this.state;

      if (fontSizeOption === 2) {
        return (
          <TouchableOpacity
            style={styles.fontButtonChecked}
            onPress={onChangeFontSize(2)}>
            <Text style={{fontSize: 16}}>16pt</Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            style={styles.fontButton}
            onPress={onChangeFontSize(2)}>
            <Text style={{fontSize: 16}}>16pt</Text>
          </TouchableOpacity>
        );
      }
    };

    const FontSizeButton18 = () => {
      const {fontSizeOption} = this.state;

      if (fontSizeOption === 3) {
        return (
          <TouchableOpacity
            style={styles.fontButtonChecked}
            onPress={onChangeFontSize(3)}>
            <Text style={{fontSize: 18}}>18pt</Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            style={styles.fontButton}
            onPress={onChangeFontSize(3)}>
            <Text style={{fontSize: 18}}>18pt</Text>
          </TouchableOpacity>
        );
      }
    };

    return (
      <View style={styles.fontButtonContainer}>
        {FontSizeButton12()}
        {FontSizeButton14()}
        {FontSizeButton16()}
        {FontSizeButton18()}
      </View>
    );
  };

  render() {
    const {closeHandler} = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{width: 60}}></View>
          <Text style={styles.headerTitle}>보기 설정</Text>
          <TouchableOpacity onPress={closeHandler}>
            <View style={styles.headerImageWrapper}>
              <Image
                style={styles.headerImage}
                source={require('../../../../assets/ic_close.png')}></Image>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.fontFamily}>글꼴</Text>
        {this.FontFamilyButtonComponent()}

        <Text style={[styles.fontSize, {marginTop: 20}]}>글짜크기</Text>
        {this.FontSizeButtonComponent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'absolute',
    width: '95%',
    bottom: 110,
    borderRadius: 5,
    backgroundColor: 'white',
    left: '2.5%',
    height: '45%',
    borderWidth: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  headerImageWrapper: {
    padding: 10,
    paddingRight: 15,
    paddingLeft: 15,
  },

  headerImage: {
    resizeMode: 'contain',
    width: 30,
    height: 30,
  },

  fontFamily: {
    marginLeft: 20,
    fontSize: 14,
    fontWeight: 'bold',
  },

  fontSize: {
    marginLeft: 20,
    fontSize: 14,
    fontWeight: 'bold',
  },

  fontButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    paddingLeft: '4%',
    paddingRight: '4%',
    marginTop: 6,
  },

  fontButton: {
    borderWidth: 1,
    width: '23%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderColor: '#595959',
  },

  fontButtonChecked: {
    width: '23%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderColor: '#F6D440',
    borderWidth: 3,
  },
});
