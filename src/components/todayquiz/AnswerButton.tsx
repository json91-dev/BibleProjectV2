import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const AnswerButton = ({ isOpenAnswer, pageState, moveToNextQuiz, submitAnswer, completeQuizAndSave }) => {
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
    // 마지막 문제일경우 `완료` 버튼 표시
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
