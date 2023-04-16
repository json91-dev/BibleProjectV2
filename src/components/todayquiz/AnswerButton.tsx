import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const AnswerButton = ({ isOpenAnswer, pageState, moveToNextQuiz, submitAnswer, completeQuizAndSave }) => {
  // 정답 확인 전, 정답확인 버튼, 이후 다음문제 버튼 출력
  // pageState가 4이상일경우 모든 문제를 푼 상태이므로 확인버튼을 눌렀을때 오늘의 퀴즈 컴포넌트에서 빠져나가야 한다.
  if (!isOpenAnswer) {
    return (
      <TouchableOpacity style={styles.answerSubmitButton} onPress={submitAnswer}>
        <Text style={styles.answerSubmitButtonText}>정답 제출</Text>
      </TouchableOpacity>
    );
  } else if (isOpenAnswer && pageState < 4) {
    return (
      <TouchableOpacity style={styles.answerSubmitButton} onPress={moveToNextQuiz}>
        <Text style={styles.answerSubmitButtonText}>다음 문제</Text>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity style={styles.answerSubmitButton} onPress={completeQuizAndSave}>
        <Text style={styles.answerSubmitButtonText}>완료</Text>
      </TouchableOpacity>
    );
  }
};

export default AnswerButton;

const styles = StyleSheet.create({
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
});
