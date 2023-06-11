import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

import { getItemFromAsyncStorage, setItemToAsyncStorage } from '../../../utils';
import {
  FONT_FAMILY_BASIC,
  FONT_FAMILY_KOREAN_GIR,
  FONT_FAMILY_NANUM_BRUSH,
  FONT_FAMILY_OPTION,
  FONT_FAMILY_TMON_SORI_BLACK,
  FONT_SIZE_12,
  FONT_SIZE_14,
  FONT_SIZE_16,
  FONT_SIZE_18,
  FONT_SIZE_OPTION,
} from '../../../constraints';

const FontChangeOption = ({ closeHandler, changeFontFamilyHandler, changeFontSizeHandler }) => {
  const [fontSizeOption, setFontSizeOption] = useState(FONT_SIZE_12);
  const [fontFamilyOption, setFontFamilyOption] = useState(FONT_FAMILY_BASIC);

  // 로컬스토리지에서 FontSize 및 FontFamily 를 불러온뒤 초기화 진행
  useEffect(() => {
    const initializeFontOption = async () => {
      let item = await getItemFromAsyncStorage<number>(FONT_SIZE_OPTION);
      if (item === null) {
        setFontSizeOption(1);
      } else {
        setFontSizeOption(item);
      }

      item = await getItemFromAsyncStorage<number>(FONT_FAMILY_OPTION);
      if (item === null) {
        setFontFamilyOption(0);
      } else {
        setFontFamilyOption(item);
      }
    };

    initializeFontOption().then();
  }, []);

  const onChangeFontFamily = useCallback(option => {
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
    setFontFamilyOption(option);
    setItemToAsyncStorage(FONT_FAMILY_OPTION, option).then();
  }, []);

  const onChangeFontSize = useCallback(option => {
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
    setFontSizeOption(option);
    setItemToAsyncStorage(FONT_SIZE_OPTION, option).then();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 60 }}></View>
        <Text style={styles.headerTitle}>보기 설정</Text>
        <TouchableOpacity onPress={closeHandler}>
          <View style={styles.headerImageWrapper}>
            <Image style={styles.headerImage} source={require('../../../assets/ic_close.png')}></Image>
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.fontFamily}>글꼴</Text>
      <View style={styles.fontButtonsContainer}>
        <TouchableOpacity
          style={[fontFamilyOption === FONT_FAMILY_BASIC ? styles.fontButtonChecked : styles.fontButton]}
          onPress={() => onChangeFontFamily(FONT_FAMILY_BASIC)}>
          <Text style={{ fontSize: 12, fontFamily: 'system font' }}>기본</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[fontFamilyOption === FONT_FAMILY_NANUM_BRUSH ? styles.fontButtonChecked : styles.fontButton]}
          onPress={() => onChangeFontFamily(FONT_FAMILY_NANUM_BRUSH)}>
          <Text style={{ fontSize: 12, fontFamily: 'NanumBrush' }}>맑은체</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[fontFamilyOption === FONT_FAMILY_TMON_SORI_BLACK ? styles.fontButtonChecked : styles.fontButton]}
          onPress={() => onChangeFontFamily(FONT_FAMILY_TMON_SORI_BLACK)}>
          <Text style={{ fontSize: 12, fontFamily: 'TmonMonsoriBlack' }}>명조체</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[fontFamilyOption === FONT_FAMILY_KOREAN_GIR ? styles.fontButtonChecked : styles.fontButton]}
          onPress={() => onChangeFontFamily(FONT_FAMILY_KOREAN_GIR)}>
          <Text style={{ fontSize: 12, fontFamily: 'KoreanGIR-L' }}>기린체</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.fontSize, { marginTop: 20 }]}>글짜크기</Text>
      <View style={styles.fontButtonsContainer}>
        <TouchableOpacity
          style={[fontSizeOption === FONT_SIZE_12 ? styles.fontButtonChecked : styles.fontButton]}
          onPress={() => onChangeFontSize(FONT_SIZE_12)}>
          <Text style={{ fontSize: 12 }}>12pt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[fontSizeOption === FONT_SIZE_14 ? styles.fontButtonChecked : styles.fontButton]}
          onPress={() => onChangeFontSize(FONT_SIZE_14)}>
          <Text style={{ fontSize: 14 }}>14pt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[fontSizeOption === FONT_SIZE_16 ? styles.fontButtonChecked : styles.fontButton]}
          onPress={() => onChangeFontSize(FONT_SIZE_16)}>
          <Text style={{ fontSize: 16 }}>16pt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[fontSizeOption === FONT_SIZE_18 ? styles.fontButtonChecked : styles.fontButton]}
          onPress={() => onChangeFontSize(FONT_SIZE_18)}>
          <Text style={{ fontSize: 18 }}>18pt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FontChangeOption;

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

  fontButtonsContainer: {
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
