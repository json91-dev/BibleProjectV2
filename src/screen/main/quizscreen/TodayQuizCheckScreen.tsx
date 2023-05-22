import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

import QuizBall from '../../../components/common/QuizBall';
import TodayQuizItem from '../../../components/todayquiz/TodayQuizItem';
import { getItemFromAsync } from '../../../utils';
import AnswerButton from '../../../components/todayquizcheck/AnswerButton';

const TodayQuizCheckScreen = ({ navigation }) => {
  const [currentQuizBallState, setCurrentQuizBallState] = useState([-1, -1, -1, -1, -1]);
  const [quizAnswerTextArray, setQuizAnswerTextArray] = useState([]);
  const [pageState, setPageState] = useState(0);
  const [isOpenAnswer, setIsOpenAnswer] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [curPageQuizData, setCurPageQuizData] = useState(null);

  // 다음 퀴즈로 이동
  const onMoveNextQuiz = useCallback(() => {
    setIsOpenAnswer(true);
    setCurPageQuizData(quizData[pageState + 1]);
    setPageState(pageState + 1);
  }, [quizData, pageState]);

  // 이전 퀴즈로 이동
  const onMovePrevQuiz = useCallback(() => {
    setIsOpenAnswer(true);
    setCurPageQuizData(quizData[pageState - 1]);
    setPageState(pageState - 1);
  }, [quizData, pageState]);

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
      setQuizData(checkQuizDataList);
      setCurPageQuizData(checkQuizDataList[0]);
      setCurrentQuizBallState(todayQuizBallState);
      setQuizAnswerTextArray(todayQuizAnswerList);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container} contentContainerStyle={{ justifyContent: 'center' }}>
      <View style={styles.contentContainer}>
        <View style={styles.closeView}>
          <TouchableOpacity style={styles.closeButton} onPress={navigation.goBack}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.todayQuizTitleView}>
          <Text style={styles.todayQuizTitleText}>오늘의 세례문답 {pageState + 1}/5</Text>
          <QuizBall quizBallState={currentQuizBallState} />
        </View>

        {curPageQuizData && <TodayQuizItem quizData={curPageQuizData} isOpened={true} isOpenedCheck={true} />}
        {isOpenAnswer && (
          <View style={styles.confirmAnswerView}>
            <Text style={styles.confirmAnswerLabel}>입력하신 정답은</Text>
            <Text style={styles.confirmAnswerText}>{quizAnswerTextArray[pageState]}</Text>
          </View>
        )}

        <AnswerButton pageState={pageState} onMovePrevQuiz={onMovePrevQuiz} onMoveNextQuiz={onMoveNextQuiz} />
      </View>
    </SafeAreaView>
  );
};

export default TodayQuizCheckScreen;

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
