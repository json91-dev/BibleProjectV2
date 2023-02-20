import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  Clipboard,
} from 'react-native';

import Toast, {DURATION} from 'react-native-easy-toast';
import BibleListOption from '../screen/main/biblescreen/components/biblelistOption/BibleListOption';
import BibleNoteOption from '../screen/main/biblescreen/components/BibleNoteOption';
import FontChangeOption from '../screen/main/biblescreen/components/FontChangeOption';
import {uuidv4, getItemFromAsync, setItemToAsync} from '../utils';
import {StackActions} from '@react-navigation/native';
import {getSqliteDatabase, printIsNewOrOldBibleByBookCode} from '../utils';
import LoadingSpinner from '../screen/components/LoadingSpinner';

export default class VerseListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      verseItems: [],
      modalVisible: false,
      memoModalVisible: false,
      memoModalSaveButtonActive: false,
      bibleListOptionIconUri: require('../assets/ic_option_list_off.png'),
      bibleNoteOptionIconUri: require('../assets/ic_option_note_off.png'),
      fontChangeOptionIconUri: require('../assets/ic_option_font_off.png'),
      optionComponentState: '',
      changeVerse: false,
      bibleType: 0,
      modalBibleItem: {},
      verseItemFontSize: 14,
      verseItemFontFamily: 'system font',
    };
  }

  componentDidMount() {
    const {route} = this.props;
    const {bookName, bookCode, chapterCode} = route.params;

    /**
     * 최근 읽은 성경 주소 저장
     */
    const saveLatelyReadBible = () => {
      const bibleName = printIsNewOrOldBibleByBookCode(bookCode);
      const readItem = {
        bibleName,
        bookName,
        bookCode,
        chapterCode,
      };

      setItemToAsync('latelyReadList', readItem).then(result => {
        console.log(result);
      });
    };
    saveLatelyReadBible();

    // 초기에 로컬 스토리지에서 저장된 폰트 사이즈와 폰트 패밀리를 설정합니다.
    const setFontSizeAndFamily = () => {
      getItemFromAsync('fontSizeOption').then(item => {
        if (item === null) {
          this.setState({
            verseItemFontSize: 14,
          });
        } else {
          switch (item) {
            case 0:
              this.setState({
                verseItemFontSize: 12,
              });
              break;
            case 1:
              this.setState({
                verseItemFontSize: 14,
              });
              break;
            case 2:
              this.setState({
                verseItemFontSize: 16,
              });
              break;
            case 3:
              this.setState({
                verseItemFontSize: 18,
              });
              break;
          }
        }
      });

      getItemFromAsync('fontFamilyOption').then(item => {
        if (item === null) {
          this.setState({
            verseItemFontFamily: 'system font',
          });
        } else {
          switch (item) {
            case 0:
              this.setState({
                verseItemFontFamily: 'system font',
              });
              break;
            case 1:
              this.setState({
                verseItemFontFamily: 'nanumbrush',
              });
              break;
            case 2:
              this.setState({
                verseItemFontFamily: 'tmonmonsori',
              });
              break;
            case 3:
              this.setState({
                verseItemFontFamily: 'applemyungjo',
              });
              break;
          }
        }
      });
    };
    setFontSizeAndFamily();

    // sqlite 데이터베이스에서 성경의 정보를 가져와서 verseItems을 만들어서 다음 Promise chain으로 전달하는 메서드
    const getBibleVerseItems = () => {
      return new Promise((resolve, reject) => {
        getSqliteDatabase().transaction(tx => {
          // 성경의 절과 내용을 모두 가져오는 쿼리를 선언
          // subQuery를 통해 현재 아이템의 최대 chapterCode를 가져온다.
          const query = `SELECT verse, content, (SELECT max(chapter) From bible_korHRV where book = ${bookCode}) as maxChapter FROM bible_korHRV where book = ${bookCode} and chapter = ${chapterCode}`;
          tx.executeSql(query, [], (tx, results) => {
            let verseItemsLength = results.rows.length;
            const verseItems = [];

            for (let i = 0; i < verseItemsLength; i++) {
              const content = results.rows.item(i).content;
              const verseCode = results.rows.item(i).verse;
              const maxChapterCode = results.rows.item(i).maxChapter;
              verseItems.push({
                bookName,
                bookCode,
                chapterCode,
                content,
                verseCode,
                maxChapterCode,
              });

              // 마지막 성경 이동 버튼을 위해 현재 verseItems의 마지막행에 하나의 목록을 더 추가한다.
              if (i === verseItemsLength - 1) {
                verseItems.push({
                  isButton: true,
                  bookName,
                  bookCode,
                  chapterCode,
                  maxChapterCode,
                  content,
                  verseCode,
                });
              }
            }
            resolve(verseItems);
          });
        });
      });
    };

    /**
     * VerseItem을 입력받아 isHighlight 값을 설정하는 메서드.
     * 1. Json 파싱을 통해 highlightList에서부터 하이라이트 목록을 받아온다.
     * 2. 현재 verseItems중 hightlightList에 bookCode, chapterCode, VerseCode가 일치하는 목록이 있다면 isHighlight = true인 verseItems을 return한다.
     */
    const getHighlight = verseItems => {
      return new Promise((resolve, reject) => {
        getItemFromAsync('highlightList').then(items => {
          if (items === null) items = [];
          verseItems.map(verse => {
            const index = items.findIndex(highlight => {
              return (
                highlight.bookCode === verse.bookCode &&
                highlight.chapterCode === verse.chapterCode &&
                highlight.verseCode === verse.verseCode
              );
            });
            index > -1
              ? (verse.isHighlight = true)
              : (verse.isHighlight = false);
            return verse;
          });
          resolve(verseItems);
        });
      });
    };

    // localStorage에서 각 성경 구절이 메모가 등록되었는지 아닌지 판단한뒤 isMemo라는 값을 주입시켜 줌.
    // isMemo가 참이면 메모가 등록, 거짓이면 메모가 등록되지 않았다는 의미이다.
    const getMemo = verseItems => {
      return new Promise((resolve, reject) => {
        getItemFromAsync('memoList').then(items => {
          verseItems.map(verse => {
            if (items === null) items = [];

            //memoList중 현재 성경의 verseList목록과 책,구,절 이 일치하는 성경은 isMemo값을 true로 바꿔준다.
            const index = items.findIndex(memoItem => {
              return (
                memoItem.bookCode === verse.bookCode &&
                memoItem.chapterCode === verse.chapterCode &&
                memoItem.verseCode === verse.verseCode
              );
            });
            index > -1 ? (verse.isMemo = true) : (verse.isMemo = false);
            return verse;
          });
          resolve(verseItems);
        });
      });
    };

    new getBibleVerseItems()
      .then(getHighlight)
      .then(getMemo)
      .then(verseItems => {
        const bibleType = verseItems[0].bookCode < 40 ? 0 : 1;
        this.setState({
          verseItems,
          bibleType,
          isLoading: false,
        });
      });
  }

  // // ScrollTo 테스트
  // flatListRef;
  // scrollTo = () =>{
  //   console.log('scrollTo');
  //   this.flatListRef.scrollToIndex({animated: true, index: 20-1})
  // };

  /**
   * LongClick시 나오는 클립보드, 형광펜, 메모에대한 동작을 수행한다.
   * 클립보드 : 클립보드 복사 후 토스트 메세지 출력
   * 하이라이트 : 하이라이트가 표시되었다면 하이라이트 제거, 하이라이트가 없으면 하이라이트 표
   * 메모 : 메모 모달 화면 열기
   */
  setModalVisible(visible, modalAction) {
    this.setState({
      modalVisible: visible,
    });

    const {bookName, bookCode, chapterCode, verseCode, content, isHighlight} =
      this.state.modalBibleItem;
    switch (modalAction) {
      case 'copy':
        Clipboard.setString(content);
        this.refs.toast.show('클립보드에 복사되었습니다.');
        break;
      case 'highlight':
        if (isHighlight) {
          // 형광펜 제거 로직 구현
          getItemFromAsync('highlightList').then(items => {
            if (items === null) items = [];

            const itemIndex = items.findIndex((item, index) => {
              return (
                item.bookCode === bookCode &&
                item.chapterCode === chapterCode &&
                item.verseCode === verseCode
              );
            });

            items.splice(itemIndex, 1);
            setItemToAsync('highlightList', items).then(result => {
              this.refs.toast.show('형광펜 밑줄 제거 ^^');
            });
          });
        } else {
          getItemFromAsync('highlightList').then(items => {
            if (items === null) items = [];
            items.push({bookCode, chapterCode, verseCode});
            setItemToAsync('highlightList', items).then(result => {
              this.refs.toast.show('형광펜으로 밑줄 ^^');
            });
          });
        }
        this.componentDidMount();
        break;
      case 'memo':
        // 메모 모달 동작
        this.setMemoModalVisible(true);
        break;
    }
  }

  setMemoModalVisible(visible) {
    this.setState({
      memoModalVisible: visible,
      memoModalSaveButtonActive: false,
    });
  }

  // 성경의 아이템을 길게 눌렀을때 모달 화면을 보여주는 메서드.
  // 복사, 형광펜, 메모 기능을 위해 해당 값을 전달받는다.
  onLongPressButton = item => () => {
    this.setState({
      modalBibleItem: item,
    });
    this.setModalVisible(true);
  };

  // 하단 3개의 옵션 버튼 클릭시 아이콘을 바꿔주고 해당 옵션에 대한 컴포넌트를 렌더링 하기 위한 state를 바꿔줌.
  switchFooterOptionButtonIconAndState = optionType => () => {
    switch (optionType) {
      case 'bibleList':
        this.setState({
          bibleListOptionIconUri: require('assets/ic_option_list_on.png'),
          bibleNoteOptionIconUri: require('assets/ic_option_note_off.png'),
          fontChangeOptionIconUri: require('assets/ic_option_font_off.png'),
          optionComponentState: 'bibleList',
        });
        break;
      case 'bibleNote':
        this.setState({
          bibleListOptionIconUri: require('../assets/ic_option_list_off.png'),
          bibleNoteOptionIconUri: require('../assets/ic_option_note_on.png'),
          fontChangeOptionIconUri: require('../assets/ic_option_font_off.png'),
          optionComponentState: 'bibleNote',
        });
        break;
      case 'fontChange':
        this.setState({
          bibleListOptionIconUri: require('../assets/ic_option_list_off.png'),
          bibleNoteOptionIconUri: require('../assets/ic_option_note_off.png'),
          fontChangeOptionIconUri: require('../assets/ic_option_font_on.png'),
          optionComponentState: 'fontChange',
        });
        break;
      case 'default':
        this.setState({
          bibleListOptionIconUri: require('../assets/ic_option_list_off.png'),
          bibleNoteOptionIconUri: require('assets/ic_option_note_off.png'),
          fontChangeOptionIconUri: require('assets/ic_option_font_off.png'),
          optionComponentState: 'default',
        });
    }
  };

  closeFooterOption = () => {
    let closeFunction = this.switchFooterOptionButtonIconAndState('default');
    closeFunction();
    this.componentDidMount();
  };

  changeScreenNavigation =
    (bookName, bookCode, chapterCode, verseCode) => () => {
      const navigation = this.props.navigation;

      const popAction = StackActions.pop(2);
      navigation.dispatch(popAction);

      const pushChapterList = StackActions.push('ChapterListScreen', {
        bookCode,
        bookName,
      });
      navigation.dispatch(pushChapterList);

      const pushVerseList = StackActions.push('VerseListScreen', {
        bookCode,
        bookName,
        chapterCode,
      });
      navigation.dispatch(pushVerseList);
    };

  changeFontSize = size => {
    this.setState({
      verseItemFontSize: size,
    });
  };

  changeFontFamily = family => {
    this.setState({
      verseItemFontFamily: family,
    });
  };

  // 각 옵션에 대한 컴포넌트를 화면에 그려주는 메서드.
  showOptionComponent() {
    let visibleOptionComponent;
    switch (this.state.optionComponentState) {
      case 'bibleList':
        // 성경이 구약인지 신약인지 BibleListOption컴포넌트에 전달한다.
        visibleOptionComponent = (
          <BibleListOption
            changeScreenHandler={this.changeScreenNavigation}
            bibleType={this.state.bibleType}
            closeHandler={this.closeFooterOption}
          />
        );
        break;
      case 'bibleNote':
        visibleOptionComponent = (
          <BibleNoteOption
            toastRef={this.refs.toast}
            closeHandler={this.closeFooterOption}
          />
        );
        break;
      case 'fontChange':
        visibleOptionComponent = (
          <FontChangeOption
            closeHandler={this.closeFooterOption}
            changeFontSizeHandler={this.changeFontSize}
            changeFontFamilyHandler={this.changeFontFamily}
          />
        );
        break;
      case 'default':
        visibleOptionComponent = null;
    }
    return visibleOptionComponent;
  }

  // 성경의 verse를 Long Click시에 modal을 띄워준다.
  LongClickModal = () => {
    const HighLightButton = () => {
      const {isHighlight} = this.state.modalBibleItem;

      if (isHighlight) {
        return (
          <TouchableOpacity
            style={styles.highlightButtonChecked}
            onPress={() => {
              this.setModalVisible(false, 'highlight');
            }}>
            <Image
              style={styles.modalItemImage}
              source={require('/assets/ic_color_pen.png')}
            />
            <Text style={styles.modalItemText}>형광펜</Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            style={styles.highlightButton}
            onPress={() => {
              this.setModalVisible(false, 'highlight');
            }}>
            <Image
              style={styles.modalItemImage}
              source={require('/assets/ic_color_pen.png')}
            />
            <Text style={styles.modalItemText}>형광펜</Text>
          </TouchableOpacity>
        );
      }
    };

    const MemoButton = () => {
      const {isMemo} = this.state.modalBibleItem;
      // TODO : 현재 모달화면에서 이미 메모가 존재한다면 modal을 닫고 현재 memo의 수정화면으로 이동
      // 1. modal닫기
      // 2. BibleNoteOption열기
      const openCurrentBibleNote = () => {
        this.setModalVisible(false);
        const switchBibleNote =
          this.switchFooterOptionButtonIconAndState('bibleNote');
        switchBibleNote();
      };

      if (isMemo) {
        return (
          <TouchableOpacity
            style={styles.memoButtonChecked}
            onPress={openCurrentBibleNote}>
            <Image
              style={[styles.modalItemImage, {marginLeft: 3}]}
              source={require('/assets/ic_memo.png')}
            />
            <Text style={styles.modalItemText}>메모</Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            style={styles.memoButton}
            onPress={() => {
              this.setModalVisible(false, 'memo');
            }}>
            <Image
              style={[styles.modalItemImage, {marginLeft: 3}]}
              source={require('/assets/ic_memo.png')}
            />
            <Text style={styles.modalItemText}>메모</Text>
          </TouchableOpacity>
        );
      }
    };

    return (
      <Modal
        style={styles.modal}
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          this.setModalVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalHeader}>
              {this.state.modalBibleItem.bookName}{' '}
              {this.state.modalBibleItem.chapterCode}장{' '}
              {this.state.modalBibleItem.verseCode}절
            </Text>
            <View style={styles.modalViewItems}>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => {
                  this.setModalVisible(false, 'copy');
                }}>
                <Image
                  style={[styles.modalItemImage, {marginRight: 2}]}
                  source={require('/assets/ic_copy.png')}
                />
                <Text style={styles.modalItemText}>복사</Text>
              </TouchableOpacity>
              {HighLightButton()}
              {MemoButton()}
            </View>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => {
                this.setModalVisible(false);
              }}>
              <Text style={styles.modalItemText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  MemoModal = () => {
    const {bookName, bookCode, chapterCode, verseCode, content} =
      this.state.modalBibleItem;
    // 메모 입력시 왼쪽 상단위의 저장버튼에 대한 활성화를 지정한다.
    // inputText의 값 0 => inactive / 1 => active
    let memo;
    const onChangeText = text => {
      if (text.length === 0) {
        this.setState({
          memoModalSaveButtonActive: false,
        });
      }
      // setState가 반복적으로 호출되는것을 막기 위해 memoModalSaveButtonActive 설정.
      else if (!this.state.memoModalSaveButtonActive && text.length >= 1) {
        this.setState({
          memoModalSaveButtonActive: true,
        });
      }
      memo = text;
    };

    const onPressSaveButton = () => {
      getItemFromAsync('memoList').then(items => {
        if (items === null) items = [];
        const objectId = uuidv4();
        const date = new Date();
        items.push({
          objectId,
          bookName,
          bookCode,
          chapterCode,
          verseCode,
          memo,
          date,
          content,
        });
        setItemToAsync('memoList', items).then(result => {
          this.componentDidMount();
          this.setMemoModalVisible(false);
        });
      });
    };

    return (
      <Modal
        style={styles.modal}
        transparent={true}
        visible={this.state.memoModalVisible}>
        <View style={styles.memoModalContainer}>
          <View style={styles.memoModalView}>
            <View style={styles.memoModalHeader}>
              <TouchableOpacity style={styles.memoModalHeaderSave}>
                {this.state.memoModalSaveButtonActive ? (
                  <Text
                    style={styles.memoModalHeaderSaveTextActive}
                    onPress={onPressSaveButton}>
                    저장
                  </Text>
                ) : (
                  <Text style={styles.memoModalHeaderSaveText}>저장</Text>
                )}
              </TouchableOpacity>
              <Text style={styles.memoModalHeaderText}>메모</Text>
              <TouchableOpacity
                style={styles.memoModalHeaderCancel}
                onPress={() => this.setMemoModalVisible(false)}>
                <Image
                  style={styles.memoModalHeaderCancelImage}
                  source={require('/assets/ic_close.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.memoModalBible}>
              <Text style={styles.memoModalBibleVerse}>
                {bookName} {chapterCode}장 {verseCode}절
              </Text>
              <Text style={styles.memoModalBibleContent}>{content}</Text>
            </View>
            <TextInput
              onChangeText={onChangeText.bind(this)}
              multiline={true}
              placeholder={'메모를 입력해주세요.'}
              style={styles.memoModalTextInput}
            />
          </View>
        </View>
      </Modal>
    );
  };

  VerseFlatList = () => {
    const VerseItem = (item, index) => {
      // 하단(이전,다음) 버튼에 대한 이벤트 처리 메서드
      const moveChapter = (item, index) => () => {
        const navigation = this.props.navigation;
        const popAction = StackActions.pop(1);
        navigation.dispatch(popAction);
        const pushChapterList = StackActions.push('VerseListScreen', {
          bookName: item.bookName,
          bookCode: item.bookCode,
          chapterCode: index,
        });
        navigation.dispatch(pushChapterList);
      };
      const highlightText = item => {
        const {verseItemFontSize, verseItemFontFamily} = this.state;

        if (item.isHighlight) {
          return (
            <Text
              style={[
                styles.flatListItemTextHighlight,
                {fontSize: verseItemFontSize, fontFamily: verseItemFontFamily},
              ]}>
              {item.content}
            </Text>
          );
        } else {
          return (
            <Text
              style={[
                styles.flatListItemText,
                {fontSize: verseItemFontSize, fontFamily: verseItemFontFamily},
              ]}>
              {item.content}
            </Text>
          );
        }
      };

      const memoIndicator = item => {
        const {verseItemFontSize} = this.state;
        // indicator 이미지의 위치를 폰트 사이즈에 따라 상대적으로 마진값 조절.
        const indicatorMarginTop = (verseItemFontSize - 14) / 2;

        if (item.isMemo) {
          return (
            <Image
              style={[styles.memoIndicator, {marginTop: indicatorMarginTop}]}
              source={require('/assets/ic_memo_indicator.png')}
            />
          );
        } else {
          return <View style={{width: '4%'}}></View>;
        }
      };

      let verseCodeLabel = index + 1;
      const {verseItems, verseItemFontSize} = this.state;

      if (index < verseItems.length - 1) {
        return (
          <TouchableOpacity
            style={styles.flatList}
            onLongPress={this.onLongPressButton(item)}>
            <View style={styles.flatListVerseItem}>
              {memoIndicator(item)}
              <Text
                style={[
                  styles.flatListItemTextLabel,
                  {fontSize: verseItemFontSize},
                ]}>
                {verseCodeLabel}.{' '}
              </Text>
              {highlightText(item)}
            </View>
          </TouchableOpacity>
        );
      } else {
        // 마지막 아이템일 경우 버튼 출력
        const {chapterCode, maxChapterCode} = verseItems[0];

        // 첫번째 장일경우에는 다음장 보기 버튼만 출력
        const prevButton = () => {
          if (chapterCode > 1) {
            return (
              <TouchableOpacity
                style={styles.moveChapterBtn}
                onPress={moveChapter(item, item.chapterCode - 1)}>
                <Text style={styles.moveChapterText}>이전장 보기</Text>
              </TouchableOpacity>
            );
          } else {
            return null;
          }
        };

        // 마지막 장일경우에는 이전장 보기 버튼만 출력
        const nextButton = () => {
          if (chapterCode < maxChapterCode) {
            return (
              <TouchableOpacity
                style={styles.moveChapterBtn}
                onPress={moveChapter(item, item.chapterCode + 1)}>
                <Text style={styles.moveChapterText}>다음장 보기</Text>
              </TouchableOpacity>
            );
          } else {
            return null;
          }
        };

        return (
          <View style={styles.moveChapter}>
            {prevButton()}
            {nextButton()}
          </View>
        );
      }
    };
    const VerseItemContainer = ({item, index}) => {
      return <View>{VerseItem(item, index)}</View>;
    };

    return (
      <FlatList
        style={styles.flatList}
        contentContainerStyle={{alignItems: 'center'}}
        data={this.state.verseItems}
        keyExtractor={(item, index) => index.toString()}
        ref={ref => {
          this.flatListRef = ref;
        }}
        renderItem={VerseItemContainer}
      />
    );
  };

  render() {
    const {isLoading} = this.state;

    if (isLoading) {
      return <LoadingSpinner />;
    }

    return (
      <View style={styles.container}>
        {this.LongClickModal()}
        {this.MemoModal()}
        {this.VerseFlatList()}

        {/* 하단 목차, 성경노트, 보기설정에 대한 footer option */}
        <View
          keyboardVerticalOffset={10}
          contentContainerStyle={{borderColor: 'red'}}
          style={styles.footerOptionContainer}>
          <TouchableOpacity
            style={styles.footerOptionContainerItem}
            onPress={this.switchFooterOptionButtonIconAndState('bibleList')}>
            <Image
              style={styles.footerOptionIcon}
              source={this.state.bibleListOptionIconUri}
            />
            <Text>목차</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerOptionContainerItem}
            onPress={this.switchFooterOptionButtonIconAndState('bibleNote')}>
            <Image
              style={styles.footerOptionIcon}
              source={this.state.bibleNoteOptionIconUri}
            />
            <Text>성경노트</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerOptionContainerItem}
            onPress={this.switchFooterOptionButtonIconAndState('fontChange')}>
            <Image
              style={styles.footerOptionIcon}
              source={this.state.fontChangeOptionIconUri}
            />
            <Text>보기설정</Text>
          </TouchableOpacity>
        </View>

        {this.showOptionComponent()}
        <Toast
          ref="toast"
          positionValue={130}
          fadeInDuration={200}
          fadeOutDuration={1000}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: 'white',
  },

  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  flatList: {
    flexDirection: 'column',
  },

  flatListVerseItem: {
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row',
  },

  flatListItemTextLabel: {
    width: '7%',
    textAlign: 'center',
  },

  flatListItemText: {
    width: '86%',
    color: 'black',
    marginRight: '3%',
    paddingRight: 5,
    marginLeft: 5,
  },

  flatListItemTextHighlight: {
    width: '86%',
    color: 'black',
    marginRight: '3%',
    paddingRight: 5,
    marginLeft: 5,
    textShadowColor: 'yellow',
    textShadowRadius: 15,
  },

  memoIndicator: {
    width: '4%',
    height: 19,
    resizeMode: 'contain',
    borderColor: 'red',
  },
  /* 모달 뷰 */
  modal: {
    borderWidth: 1,
    borderColor: 'red',
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

  copyButton: {
    paddingLeft: 11,
    paddingRight: 11,
    paddingTop: 9,
    paddingBottom: 7,
    borderRadius: 20,
  },

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

  /* 메모 모달 뷰 */

  memoModalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  memoModalView: {
    width: '80%',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
  },

  memoModalHeader: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },

  memoModalHeaderSave: {},

  memoModalHeaderSaveText: {
    fontSize: 16,
    color: '#E0E0E0',
  },

  memoModalHeaderSaveTextActive: {
    fontSize: 16,
    color: '#2F80ED',
  },

  memoModalHeaderText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginRight: 1,
  },

  memoModalHeaderCancel: {},

  memoModalHeaderCancelText: {
    fontSize: 20,
  },

  memoModalHeaderCancelImage: {
    width: 25,
    height: 25,
  },

  memoModalBible: {
    width: '100%',
    backgroundColor: '#F3F4F9',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'column',
  },

  memoModalBibleVerse: {
    marginTop: '5%',
    marginLeft: '5%',
    marginRight: '5%',
    fontWeight: 'bold',
  },

  memoModalBibleContent: {
    marginTop: '5%',
    marginLeft: '5%',
    marginRight: '5%',
    marginBottom: '5%',
  },

  memoModalTextInput: {
    width: '100%',
    height: 100,
    textAlignVertical: 'top',
    padding: '5%',
  },

  /* 푸터 옵션 */
  footerOptionContainer: {
    borderWidth: 1,
    position: 'absolute',
    left: '2.5%',
    bottom: '5%',
    width: '95%',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },

  footerOptionContainerItem: {
    width: '30%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerOptionIcon: {
    width: 40,
    height: 30,
    resizeMode: 'contain',
  },

  /* 성경 버튼 이동 */
  moveChapter: {
    paddingBottom: 100,
    marginTop: 20,
    width: '90%',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  moveChapterBtn: {
    width: 130,
    height: 60,
    backgroundColor: '#F9DA4F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },

  moveChapterText: {
    fontWeight: 'bold',
  },
});
