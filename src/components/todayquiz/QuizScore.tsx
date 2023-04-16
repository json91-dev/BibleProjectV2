import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QuizBall from '../common/QuizBall';

const QuizScore = ({ pageState, quizBallState }) => {
  console.log(quizBallState);
  return (
    <View style={styles.todayQuizTitleView}>
      <Text style={styles.todayQuizTitleText}>오늘의 세례문답 {pageState + 1}/5</Text>
      <QuizBall quizBallState={quizBallState} />
    </View>
  );
};

export default QuizScore;

const styles = StyleSheet.create({
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
});
