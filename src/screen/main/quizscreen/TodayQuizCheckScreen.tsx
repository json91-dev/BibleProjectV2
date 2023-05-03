import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Keyboard, SafeAreaView } from 'react-native';

import QuizBall from '../../../components/common/QuizBall';
import TodayQuizItem from '../../../components/todayquiz/TodayQuizItem';
import { getItemFromAsync, setItemToAsync } from '../../../utils';

const TodayQuizCheckScreen = () => {
  const [currentQuizBallState, setCurrentQuizBallState] = useState([-1, -1, -1, -1, -1]);
  const [quizAnswerTextArray, setQuizAnswerTextArray] = useState([]);
  const [pageState, setPageState] = useState(0);
  const [isFocusTextInput, setIsFocusTextInput] = useState(false);
  const [textInputText, setTextInputText] = useState('');
  const [isOpenAnswer, setIsOpenAnswer] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [curPageQuizData, setCurPageQuizData] = useState(null);

  useEffect(() => {
    // 해당 부분을 서버에서 전달받도록 수정..
    // 여기서는 reviewQuizData로 전달받음.
    // 추가적으로 quizBallState 등의 값들을 가져와서 설정
    const getIsCompleteTodayQuiz = getItemFromAsync<boolean>('isCompleteTodayQuiz');
    const getReviewQuizDataList = getItemFromAsync<any[]>('reviewQuizDataList');
    const getTodayQuizAnswerList = getItemFromAsync<any[]>('todayQuizAnswerList');
    const getTodayQuizBallState = getItemFromAsync<any[]>('todayQuizBallState');

    Promise.all([getIsCompleteTodayQuiz, getReviewQuizDataList, getTodayQuizAnswerList, getTodayQuizBallState]).then(result => {
      // let isCompleteTodayQuiz = result[0];
      // reviewQuizDataList를 재사용
      const checkQuizDataList = result[1];
      const todayQuizAnswerList = result[2];
      const todayQuizBallState = result[3];

      // quizData를 reviewQuizDataList를 사용함.
      // 다음날이 되어 오늘의 퀴즈를 풀기전에 쓰이는 데이터도 reviewQuizList를 사용한다.
      this.setState({
        quizData: checkQuizDataList,
        curPageQuizData: checkQuizDataList[0],
        currentQuizBallState: todayQuizBallState,
        quizAnswerTextArray: todayQuizAnswerList,
      });
    });
  }, []);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingBottom: 100,
  },

  closeView: {
    flexDirection: 'row-reverse',
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#EDEDED',
    position: 'absolute',
    top: 0,
  },

  closeButton: {
    paddingBottom: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingLeft: 10,
  },

  closeButtonText: {
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
    bottom: 0,
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9DA4F',
    flexDirection: 'row',
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
