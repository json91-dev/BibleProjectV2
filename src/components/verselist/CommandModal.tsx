import React from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

/**
 * LongClick 시에 중앙에 있는 (복사, 형광펜, 메모)의 전체 모달 화면
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const CommandModal = ({
  modalBibleItem,
  setCommandModalVisible,
  openBibleNoteOptionModal,
  actionCommandModal,
  commandModalVisible,
}) => {
  const {isHighlight, isMemo} = modalBibleItem;

  return (
    <Modal
      style={styles.modal}
      transparent={true}
      visible={commandModalVisible}
      onRequestClose={() => {
        setCommandModalVisible(false);
      }}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.modalHeader}>
            {modalBibleItem.bookName} {modalBibleItem.chapterCode}장{' '}
            {modalBibleItem.verseCode}절
          </Text>
          <View style={styles.modalViewItems}>
            {/*Copy 버튼*/}
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => {
                setCommandModalVisible(false);
                actionCommandModal('copy');
              }}>
              <Image
                style={[styles.modalItemImage, {marginRight: 2}]}
                source={require('../../assets/ic_copy.png')}
              />
              <Text style={styles.modalItemText}>복사</Text>
            </TouchableOpacity>

            {/*Highlight 버튼*/}
            {isHighlight ? (
              <TouchableOpacity
                style={styles.highlightButtonChecked}
                onPress={() => {
                  setCommandModalVisible(false);
                  actionCommandModal('highlight');
                }}>
                <Image
                  style={styles.modalItemImage}
                  source={require('../../assets/ic_color_pen.png')}
                />
                <Text style={styles.modalItemText}>형광펜</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.highlightButton}
                onPress={() => {
                  setCommandModalVisible(false);
                  actionCommandModal('highlight');
                }}>
                <Image
                  style={styles.modalItemImage}
                  source={require('../../assets/ic_color_pen.png')}
                />
                <Text style={styles.modalItemText}>형광펜</Text>
              </TouchableOpacity>
            )}

            {/*메모 버튼*/}
            {isMemo ? (
              <TouchableOpacity
                style={styles.memoButtonChecked}
                onPress={openBibleNoteOptionModal}>
                <Image
                  style={[styles.modalItemImage, {marginLeft: 3}]}
                  source={require('../../assets/ic_memo.png')}
                />
                <Text style={styles.modalItemText}>메모</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.memoButton}
                onPress={() => {
                  setCommandModalVisible(false);
                  actionCommandModal('memo');
                }}>
                <Image
                  style={[styles.modalItemImage, {marginLeft: 3}]}
                  source={require('../../assets/ic_memo.png')}
                />
                <Text style={styles.modalItemText}>메모</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={styles.modalCancel}
            onPress={() => {
              setCommandModalVisible(false);
            }}>
            <Text style={styles.modalItemText}>취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(CommandModal);

const styles = StyleSheet.create({
  highlightButton: {
    paddingLeft: 11,
    paddingRight: 11,
    paddingTop: 9,
    paddingBottom: 7,
    borderRadius: 20,
  },

  highlightButtonChecked: {
    backgroundColor: '#F9DA4F',
    paddingLeft: 11,
    paddingRight: 11,
    paddingTop: 9,
    paddingBottom: 7,
    borderRadius: 20,
  },

  modalContainer: {
    // backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalView: {
    width: 250,
    height: 200,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
  },

  modalHeader: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10,
  },

  modalViewItems: {
    width: '90%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 25,
  },

  modalItemText: {
    color: 'black',
    fontSize: 15,
    textAlign: 'center',
  },

  modalItemImage: {
    width: 40,
    height: 30,
    resizeMode: 'contain',
  },

  modalCancel: {
    width: '100%',
    height: 50,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F4F4',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  memoButton: {
    paddingLeft: 11,
    paddingRight: 11,
    paddingTop: 9,
    paddingBottom: 7,
    borderRadius: 20,
  },

  memoButtonChecked: {
    backgroundColor: '#F9DA4F',
    paddingLeft: 11,
    paddingRight: 11,
    paddingTop: 9,
    paddingBottom: 7,
    borderRadius: 20,
  },

  copyButton: {
    paddingLeft: 11,
    paddingRight: 11,
    paddingTop: 9,
    paddingBottom: 7,
    borderRadius: 20,
  },
});
