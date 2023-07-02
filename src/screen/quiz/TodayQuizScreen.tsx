import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Keyboard, SafeAreaView, TouchableWithoutFeedback, Image } from 'react-native';
import {
  IS_COMPLETE_TODAY_QUIZ,
  IS_GIVE_UP_TODAY_QUIZ,
  QUIZ_BEFORE,
  QUIZ_SAVE_DATE,
  QUIZ_FAIL,
  QUIZ_SUCCESS,
  REVIEW_QUIZ_DATA_LIST,
  TODAY_QUIZ_ANSWER_LIST,
  TODAY_QUIZ_BALL_STATE,
} from '../../constraints';

import TodayQuizItem from '../../components/todayquiz/TodayQuizItem';
import { setItemToAsyncStorage, getDateStringByFormat, getTodayDate } from '../../utils';
import { StackActions } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import QuizScore from '../../components/todayquiz/QuizScore';
import useTextInput from '../../hooks/useTextInput';
import AnswerButton from '../../components/todayquiz/AnswerButton';
let keyboardDidHideListener = null;

const TodayQuizScreen = ({ navigation }) => {
  const [currentQuizBallState, setCurrentQuizBallState] = useState([QUIZ_BEFORE, QUIZ_BEFORE, QUIZ_BEFORE, QUIZ_BEFORE, QUIZ_BEFORE]);
  const [quizAnswerTextArray, setQuizAnswerTextArray] = useState([]);
  const [pageState, setPageState] = useState(0);
  const [checkAnswerText, setCheckAnswerText] = useState('');
  const [isOpenAnswer, setIsOpenAnswer] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [curPageQuizData, setCurPageQuizData] = useState(null);
  const [textInputText, isFocusTextInput, onChangeText, clearTextInput, onEndEdition, onFocus, onBlur, setIsFocusTextInput] =
    useTextInput();

  const textInputRef = useRef(null);

  /**
   * 1. 현재 입력된 Text가 현재 퀴즈의 정답과 일치하는지 여부를 판단하여 quizBallState 값을 바꿔줌 (정답일 경우 1, 아닐경우 0)
   * 2. 유저에 정답에 대해 입력한 값을 quizAnswerTextArray 배열에 저장함. 값을 입력하지 않으면 '없음' 저장
   * 3. 다음 단계로 이동
   */
  const submitAnswer = useCallback(() => {
    const curPageQuizWord = curPageQuizData.quizWord;
    let updateQuizBallState;

    if (curPageQuizWord === textInputText) {
      updateQuizBallState = [...currentQuizBallState];
      updateQuizBallState[pageState] = QUIZ_SUCCESS;
    } else {
      updateQuizBallState = [...currentQuizBallState];
      updateQuizBallState[pageState] = QUIZ_FAIL;
    }

    // 값을 입력하지 않으면 '없음' 문자열을 써서 처리한다.
    const quizInputText = textInputText === '' ? '없음' : textInputText;
    setCurrentQuizBallState(updateQuizBallState);
    setIsOpenAnswer(true);
    setQuizAnswerTextArray([...quizAnswerTextArray, quizInputText]);
    setCheckAnswerText(quizInputText);
    setIsFocusTextInput(false);
    clearTextInput();

    // 에외처리 해주지 않으면 오류 발생
    if (textInputRef.current) {
      textInputRef.current.blur();
      textInputRef.current.clear();
    }
  }, [textInputText, curPageQuizData, quizAnswerTextArray, currentQuizBallState, pageState, clearTextInput, setIsFocusTextInput]);

  const moveToNextQuiz = useCallback(() => {
    setIsOpenAnswer(false);
    setCurPageQuizData(quizData[pageState + 1]);
    setPageState(pageState + 1);
  }, [pageState, quizData]);

  const backToQuizMainScreen = useCallback(() => {
    const popAction = StackActions.pop(1);
    navigation.dispatch(popAction);
  }, [navigation]);

  /**
   * TODO: quizAnswerTextArray를 AsynStorage에 저장.
   * reviewQuizDataList => 다음날이 되어 퀴즈를 시작할때 풀어야 하는 복습 문제들에 대한 정보를 저장함.
   * isCompleteTodayQuiz => 오늘의 퀴즈를 모두 풀었는지에 대한 정보를 확인함.
   * todayQuizAnswerList => 오늘의 퀴즈에 대해 유저가 입력한 정답의 정보를 저장함.
   * todayQuizBallState => 오늘의 퀴즈에 대한 정답 볼 상태 저장
   * 모두 풀었을때 화면 :  결과창 + 타이머 + 푼 문제 복습 링크
   * 안풀었을때 화면 :  퀴즈 시작 링크 + 이전문제 복습
   */
  const completeQuizAndSave = useCallback(() => {
    const setReviewQuizDataList = setItemToAsyncStorage(REVIEW_QUIZ_DATA_LIST, quizData);
    const setIsCompleteTodayQuiz = setItemToAsyncStorage(IS_COMPLETE_TODAY_QUIZ, true);
    const setIsGiveUpTodayQuiz = setItemToAsyncStorage(IS_GIVE_UP_TODAY_QUIZ, false);
    const setQuizAnswerList = setItemToAsyncStorage(TODAY_QUIZ_ANSWER_LIST, quizAnswerTextArray);
    const setQuizBallState = setItemToAsyncStorage(TODAY_QUIZ_BALL_STATE, currentQuizBallState);
    const setQuizSaveDate = setItemToAsyncStorage(QUIZ_SAVE_DATE, getDateStringByFormat(new Date(), 'yyyy-MM-dd'));

    Promise.all([
      setReviewQuizDataList,
      setIsCompleteTodayQuiz,
      setIsGiveUpTodayQuiz,
      setQuizAnswerList,
      setQuizBallState,
      setQuizSaveDate,
    ]).then(() => {
      backToQuizMainScreen();
    });
  }, [quizData, quizAnswerTextArray, currentQuizBallState, backToQuizMainScreen]);

  /**
   * 1. 기존에 푼 문제에 입력한 정답과, 퀴즈 Ball의 상태 저장.
   * 2. 풀지 못한 부분에 대한 문제는 Text는 없음으로 처리하고, 퀴즈볼 상태는 -1(빨간볼)로 처리.
   * 3. 퀴즈에 대한 복습데이터 저장.
   */
  const onGiveUpTodayQuiz = useCallback(() => {
    // TODO : 유저가 빈문자를 입력했을때는 '없음' // 남은문제는 빈공백으로 처리 // 입력했을때는 입력한 값을 처리함
    const maxPageCount = 5;
    const updateQuizBallState = [...currentQuizBallState];
    let updateQuizAnswerTextArray = [...quizAnswerTextArray];

    // 포기하였기 때문에, 현재 문제를 풀고 있는 page 이후 정답을 모두 틀림으로 처리함
    let page;
    if (isOpenAnswer) {
      page = pageState + 1;
    } else {
      page = pageState;
    }
    for (page; page < maxPageCount; page++) {
      updateQuizBallState[page] = QUIZ_FAIL;
      updateQuizAnswerTextArray = [...updateQuizAnswerTextArray, '없음'];
    }

    const setReviewQuizDataList = setItemToAsyncStorage(REVIEW_QUIZ_DATA_LIST, quizData);
    const setIsCompleteTodayQuiz = setItemToAsyncStorage(IS_COMPLETE_TODAY_QUIZ, false);
    const setIsGiveUpTodayQuiz = setItemToAsyncStorage(IS_GIVE_UP_TODAY_QUIZ, true);
    const setQuizAnswerList = setItemToAsyncStorage(TODAY_QUIZ_ANSWER_LIST, updateQuizAnswerTextArray);
    const setQuizBallState = setItemToAsyncStorage(TODAY_QUIZ_BALL_STATE, updateQuizBallState);
    const setQuizSaveDate = setItemToAsyncStorage(QUIZ_SAVE_DATE, getDateStringByFormat(new Date(), 'yyyy-MM-dd'));

    Promise.all([
      setReviewQuizDataList,
      setIsCompleteTodayQuiz,
      setIsGiveUpTodayQuiz,
      setQuizAnswerList,
      setQuizBallState,
      setQuizSaveDate,
    ]).then(() => {
      backToQuizMainScreen();
    });
  }, [pageState, currentQuizBallState, quizAnswerTextArray, isOpenAnswer, quizData, backToQuizMainScreen]);

  useEffect(() => {
    const fetchTodayQuiz = async () => {
      console.log(getTodayDate());
      const doc = await firestore().collection('todayQuiz').doc(getTodayDate()).get();
      const quizDocData = doc.data().todayQuiz;
      setQuizData(quizDocData);
      setCurPageQuizData(quizDocData[0]);
    };

    fetchTodayQuiz().then();
    keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => Keyboard.dismiss());

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.contentContainer}>
          <View style={styles.headerView}>
            <TouchableOpacity onPress={backToQuizMainScreen}>
              <Image style={styles.goBackButton} source={require('../../assets/ic_left_arrow.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.giveUpButton} onPress={onGiveUpTodayQuiz}>
              <Text style={styles.giveUpButtonText}>포기하기</Text>
            </TouchableOpacity>
          </View>

          {!isFocusTextInput && <QuizScore pageState={pageState} quizBallState={currentQuizBallState} />}
          {curPageQuizData && <TodayQuizItem quizData={curPageQuizData} isOpened={isOpenAnswer} />}
          {isOpenAnswer ? (
            <View style={styles.confirmAnswerView}>
              <Text style={styles.confirmAnswerLabel}>입력하신 정답은</Text>
              <Text style={styles.confirmAnswerText}>{checkAnswerText}</Text>
            </View>
          ) : (
            <>
              <TextInput
                onFocus={onFocus}
                onBlur={onBlur}
                ref={textInputRef}
                style={styles.answerInputText}
                placeholder="정답을 입력하세요"
                onEndEditing={onEndEdition}
                blurOnSubmit={true}
                onChangeText={onChangeText}
              />
              <View style={styles.passView}>
                <TouchableOpacity onPress={submitAnswer}>
                  <Text style={styles.passButtonText}>이 문제 패스</Text>
                </TouchableOpacity>
                <Text style={styles.passButtonLabel}>패스를 하게 되면 틀림으로 간주 합니다.</Text>
              </View>
            </>
          )}

          <AnswerButton
            isOpenAnswer={isOpenAnswer}
            pageState={pageState}
            moveToNextQuiz={moveToNextQuiz}
            submitAnswer={submitAnswer}
            completeQuizAndSave={completeQuizAndSave}
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default TodayQuizScreen;

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

  headerView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#EDEDED',
    position: 'absolute',
    top: 0,
  },

  goBackButton: {
    width: 30,
    height: 30,
    marginLeft: 10,
    resizeMode: 'contain',
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
    marginTop: 40,
    borderWidth: 1,
  },

  passView: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  passButtonText: {
    borderWidth: 1,
    marginTop: 30,
    textAlign: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 5,
    width: 100,
  },

  passButtonLabel: {
    width: '100%',
    textAlign: 'center',
    color: '#828282',
    marginTop: 15,
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
