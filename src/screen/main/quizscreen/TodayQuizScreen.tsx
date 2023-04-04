import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, TextInput, Keyboard, SafeAreaView} from 'react-native';

import QuizBall from './components/QuizBall';
import TodayQuizItem from './components/TodayQuizItem';
import {setItemToAsync, getDateStringByFormat} from '../../../utils';
import {StackActions} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

export default class TodayQuizScreen extends Component {
  state = {
    currentQuizBallState: [-1, -1, -1, -1, -1],
    quizAnswerTextArray: [],
    pageState: 0,
    isFocusTextInput: false,
    textInputText: '',
    checkAnswerText: '', // 입력된 정답에 대한 텍스트
    isOpenAnswer: false, // 정답 확인화면일때 true, 문제입력 화면일때 false
    quizData: null,
    curPageQuizData: null,
  };

  componentDidMount() {
    const todayDateString = getDateStringByFormat(new Date(), 'yyyy-MM-dd');

    // 오늘의 날짜를 기준으로 데이터를 서버에서 가져옵니다.
    firestore()
      .collection('todayQuiz')
      .doc('2020-05-05')
      .get()
      .then(doc => {
        // alert('서버로부터 데이터 받아옴');

        if (doc.data() === undefined) {
          return;
        }

        const quizData = doc.data().quizData;
        this.setState({
          quizData: quizData,
          curPageQuizData: quizData[0],
        });
      });

    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
  }

  // 키보드가 사라질때 발생하는 이벤트 선언.
  // Keyboard가 dismiss되면 자동으로 blur 호출
  _keyboardDidHide = () => {
    // this.refs.textInputRef.blur();
    Keyboard.dismiss();
  };

  render() {
    // 버튼이 포커스되면 searchView를 보여줌
    const onFocus = () => {
      this.setState(prevState => {
        return {
          isFocusTextInput: true,
        };
      });
    };

    // 버튼의 Focus가 풀렸을 시 동작함.
    const onBlur = () => {
      this.setState(prevState => {
        return {
          isFocusTextInput: false,
        };
      });
    };

    /**
     * 퀴즈의 정답 여부를 체크한다.
     * 현재 입력된 Text가 현재 퀴즈의 정답과 일치하는지 여부를 판단하여 quizBallState값을 바꿔준다.
     * 현재 입력한 textInput을 quizAnswerTextArray 배열에 저장합니다.
     * 다음 단계로 이동한다.
     */
    const onAnswerSubmit = () => {
      const {curPageQuizData, pageState, textInputText, currentQuizBallState} = this.state;

      // 정답의 진위여부를 판단한다.
      const curPageQuizWord = curPageQuizData.quizWord;
      let updateQuizBallState;

      // quizBallState를 바꿔줌.
      if (curPageQuizWord === textInputText) {
        // 정답일 경우 quizBallState를 1로 바꿔준다.
        updateQuizBallState = [...currentQuizBallState];
        updateQuizBallState[pageState] = 1;
      } else {
        // 정답이 아닐경우 quizBallState를 0으로 바꿔준다.
        updateQuizBallState = [...currentQuizBallState];
        updateQuizBallState[pageState] = 0;
      }

      // 유저의 정답에 대한 입력값을 저장하기 위한 변수를 선언한다.
      // 값을 입력하지 않으면 '없음' 문자열을 써서 처리한다.
      const quizInputText = textInputText === '' ? '없음' : textInputText;

      this.setState(prevState => {
        return {
          currentQuizBallState: updateQuizBallState,
          isOpenAnswer: true,
          isFocusTextInput: false,
          quizAnswerTextArray: [...prevState.quizAnswerTextArray, quizInputText],
          checkAnswerText: quizInputText,
          textInputText: '',
        };
      });

      // 에외처리 해주지 않으면 오류 발생
      if (this.refs.textInputRef) {
        this.refs.textInputRef.blur();
        this.refs.textInputRef.clear();
      }
    };

    const onMoveNextQuiz = () => {
      const {pageState, quizData} = this.state;

      this.setState(prevState => {
        return {
          isOpenAnswer: false,
          curPageQuizData: quizData[pageState + 1],
          pageState: prevState.pageState + 1,
        };
      });
    };

    const backToQuizMainScreen = () => {
      const navigation = this.props.navigation;
      const popAction = StackActions.pop(1);
      navigation.dispatch(popAction);
    };

    /**
     * TODO: quizAnswerTextArray를 AsynStorage에 저장.
     * reviewQuizDataList => 다음날이 되어 퀴즈를 시작할때 풀어야 하는 복습 문제들에 대한 정보를 저장함.
     * isCompleteTodayQuiz => 오늘의 퀴즈를 모두 풀었는지에 대한 정보를 확인함.
     * todayQuizAnswerList => 오늘의 퀴즈에 대해 유저가 입력한 정답의 정보를 저장함.
     * todayQuizBallState => 오늘의 퀴즈에 대한 정답 볼 상태 저장
     * 모두 풀었을때 => 결과창 + 타이머 + 푼 문제 복습 링크
     * 안풀었을때 => 퀴즈 시작 링크 + 이전문제 복습
     */
    const onCompleteTodayQuiz = () => {
      const {quizData, quizAnswerTextArray, currentQuizBallState} = this.state;
      const setReviewQuizDataList = setItemToAsync('reviewQuizDataList', quizData);
      const setIsCompleteTodayQuiz = setItemToAsync('isCompleteTodayQuiz', true);
      const setIsGiveUpTodayQuiz = setItemToAsync('isGiveUpTodayQuiz', false);
      const setQuizAnswerList = setItemToAsync('todayQuizAnswerList', quizAnswerTextArray);
      const setQuizBallState = setItemToAsync('todayQuizBallState', currentQuizBallState);
      const setQuizDate = setItemToAsync('quizDate', parseInt(getDateStringByFormat(new Date(), 'yyyyMMdd')));

      Promise.all([
        setReviewQuizDataList,
        setIsCompleteTodayQuiz,
        setIsGiveUpTodayQuiz,
        setQuizAnswerList,
        setQuizBallState,
        setQuizDate,
      ]).then(result => {
        backToQuizMainScreen();
      });
    };

    // 현재 퀴즈를 패스하는 함수.
    const passCurrentQuiz = () => {
      onAnswerSubmit();
    };

    /**
     *  오늘의 퀴즈를 포기하는 함수이다.
     *  현재 볼의 상태(맞춘 문제)와 정답에 대해서 AsyncStorage에 갱신.
     *  기존에 푼 문제에 입력한 정답과, 퀴즈 Ball의 상태는 저장하고 남은 부분을 채워준다.
     *  Text는 없음으로 처리하고, 퀴즈볼 상태는 -1(빨간볼)로 처리한다.
     *  이후 퀴즈 복습데이터도 AsyncStorage에 업데이트 한다.
     */
    const onGiveUpTodayQuiz = () => {
      // TODO : 유저가 빈문자를 입력했을때는 '없음' // 남은문제는 빈공백으로 처리 // 입력했을때는 입력한 값을 처리함
      const {pageState, currentQuizBallState, quizAnswerTextArray, isOpenAnswer, quizData} = this.state;
      const maxPageCount = 5;

      // AsyncStorage에 업데이트할 State를 선언함.
      const updateQuizBallState = [...currentQuizBallState];
      let updateQuizAnswerTextArray = [...quizAnswerTextArray];

      let page;
      // 해당 page 이후 정답을 모두 틀림으로 처리함
      if (isOpenAnswer) {
        page = pageState + 1;
      } else {
        page = pageState;
      }

      // quizBallState => -1: 기본 , 0: 틀림, 1: 맞음
      for (page; page < maxPageCount; page++) {
        updateQuizBallState[page] = 0;
        updateQuizAnswerTextArray = [...updateQuizAnswerTextArray, '없음'];
      }

      const setReviewQuizDataList = setItemToAsync('reviewQuizDataList', quizData);
      const setIsCompleteTodayQuiz = setItemToAsync('isCompleteTodayQuiz', false);
      const setIsGiveUpTodayQuiz = setItemToAsync('isGiveUpTodayQuiz', true);
      const setQuizAnswerList = setItemToAsync('todayQuizAnswerList', updateQuizAnswerTextArray);
      const setQuizBallState = setItemToAsync('todayQuizBallState', updateQuizBallState);
      const setQuizDate = setItemToAsync('quizDate', parseInt(getDateStringByFormat(new Date(), 'yyyyMMdd')));

      Promise.all([
        setReviewQuizDataList,
        setIsCompleteTodayQuiz,
        setIsGiveUpTodayQuiz,
        setQuizAnswerList,
        setQuizBallState,
        setQuizDate,
      ]).then(result => {
        backToQuizMainScreen();
      });
    };

    /**
     * 컴포넌트 분리.
     */
    const TodayQuizTitleView = () => {
      const {isFocusTextInput, currentQuizBallState, pageState} = this.state;
      if (!isFocusTextInput) {
        return (
          <View style={styles.todayQuizTitleView}>
            <Text style={styles.todayQuizTitleText}>오늘의 세례문답 {pageState + 1}/5</Text>
            <QuizBall quizBallState={currentQuizBallState} />
          </View>
        );
      } else {
        return null;
      }
    };

    // 퀴즈의 내용과 성경구절을 알려주는 퀴즈 컴포넌트.
    // data를 올바르게 받아왔을때 todayQuiz컴포넌트를 열어준다.
    // 유저가 정답을 입력한 경우 props로 정답확인을 알려준다.
    const ShowTodayQuizItemComponent = () => {
      const {curPageQuizData} = this.state;
      if (curPageQuizData) {
        return <TodayQuizItem quizData={this.state.curPageQuizData} isOpened={this.state.isOpenAnswer} />;
      } else {
        return null;
      }
    };

    // quiz 입력에 사용되는 textInput 컴포넌트
    const QuizTextInput = () => {
      const {isOpenAnswer} = this.state;
      if (!isOpenAnswer) {
        return (
          <TextInput
            onFocus={onFocus}
            onBlur={onBlur}
            ref="textInputRef"
            style={styles.answerInputText}
            placeholder="정답을 입력하세요"
            onEndEditing={onBlur}
            blurOnSubmit={true}
            onChangeText={text => {
              this.setState({
                textInputText: text,
              });
            }}
          />
        );
      } else {
        return null;
      }
    };

    // 현재 퀴즈에 대한 Pass Button을 가진 컴포넌트
    const PassCurrentQuiz = () => {
      const {isOpenAnswer} = this.state;
      if (!isOpenAnswer) {
        return (
          <View>
            <TouchableOpacity onPress={passCurrentQuiz} style={styles.passButton}>
              <Text style={styles.passButtonText}>이 문제 패스</Text>
            </TouchableOpacity>
            <Text style={styles.passButtonLabel}>패스를 하게 되면 틀림으로 간주 합니다.</Text>
          </View>
        );
      } else {
        return null;
      }
    };

    // 정답에 대해 유저의 입력을 확인시켜주는 컴포넌트.
    const ConfirmCurrentQuizAnswer = () => {
      const {isOpenAnswer} = this.state;
      let {textInputText, checkAnswerText} = this.state;

      // if (textInputText === '' || textInputText === ' '|| textInputText === '  ') {
      //   textInputText = '없음'
      // }

      if (isOpenAnswer) {
        return (
          <View style={styles.confirmAnswerView}>
            <Text style={styles.confirmAnswerLabel}>입력하신 정답은</Text>
            <Text style={styles.confirmAnswerText}>{checkAnswerText}</Text>
          </View>
        );
      }
      {
        return null;
      }
    };

    // 정답제출 버튼 및 다음 화면으로 이동 버튼에 대한 컴포넌트
    const AnswerButton = () => {
      const {isOpenAnswer, pageState} = this.state;

      // 정답 확인 전, 정답확인 버튼, 이후 다음문제 버튼 출력
      // pageState가 4이상일경우 모든 문제를 푼 상태이므로 확인버튼을 눌렀을때 오늘의 퀴즈 컴포넌트에서 빠져나가야 한다.

      if (!isOpenAnswer) {
        return (
          <TouchableOpacity style={styles.answerSubmitButton} onPress={onAnswerSubmit}>
            <Text style={styles.answerSubmitButtonText}>정답 제출</Text>
          </TouchableOpacity>
        );
      } else if (isOpenAnswer && pageState < 4) {
        return (
          <TouchableOpacity style={styles.answerSubmitButton} onPress={onMoveNextQuiz}>
            <Text style={styles.answerSubmitButtonText}>다음 문제</Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity style={styles.answerSubmitButton} onPress={onCompleteTodayQuiz}>
            <Text style={styles.answerSubmitButtonText}>완료</Text>
          </TouchableOpacity>
        );
      }
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.giveUpView}>
            <TouchableOpacity style={styles.giveUpButton} onPress={onGiveUpTodayQuiz}>
              <Text style={styles.giveUpButtonText}>포기하기</Text>
            </TouchableOpacity>
          </View>
          {TodayQuizTitleView()}
          {ShowTodayQuizItemComponent()}
          {QuizTextInput()}
          {PassCurrentQuiz()}
          {ConfirmCurrentQuizAnswer()}
          {AnswerButton()}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },

  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingBottom: 100,
  },

  giveUpView: {
    flexDirection: 'row-reverse',
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#EDEDED',
    position: 'absolute',
    top: 0,
  },

  giveUpButton: {
    paddingBottom: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingLeft: 10,
  },

  giveUpButtonText: {
    fontSize: 15,
  },

  todayQuizTitleView: {
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },

  todayQuizTitleText: {
    fontSize: 18,
    marginTop: 20,
  },

  answerInputText: {
    width: '80%',
    borderBottomWidth: 1,
    marginLeft: '10%',
    textAlign: 'center',
    fontSize: 20,
    borderColor: '#EDEDED',
    color: '#BDBDBD',
    marginTop: '8%',
  },

  passButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },

  passButtonText: {
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 5,
  },

  passButtonLabel: {
    width: '100%',
    textAlign: 'center',
    color: '#828282',
    marginTop: 15,
  },

  answerSubmitButton: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9DA4F',
  },

  answerSubmitButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },

  confirmAnswerView: {
    alignItems: 'center',
    marginTop: 40,
  },

  confirmAnswerLabel: {},

  confirmAnswerText: {
    fontSize: 20,
    marginTop: 11,
  },
});
