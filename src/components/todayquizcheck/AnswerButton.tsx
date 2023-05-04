import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

const AnswerButton = ({ pageState, onMovePrevQuiz, onMoveNextQuiz }) => {
  if (pageState === 0) {
    return (
      <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={[styles.answerSubmitButton, { width: '100%' }]} onPress={onMoveNextQuiz}>
            <Text style={styles.answerSubmitButtonText}>다음문제</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else if (pageState > 0 && pageState < 4) {
    return (
      <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={[styles.answerSubmitButton, { width: '50%' }]} onPress={onMovePrevQuiz}>
            <Text style={styles.answerSubmitButtonText}>이전문제</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.answerSubmitButton, { width: '50%' }]} onPress={onMoveNextQuiz}>
            <Text style={styles.answerSubmitButtonText}>다음문제</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else if (pageState === 4) {
    return (
      <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={[styles.answerSubmitButton, { width: '100%' }]} onPress={onMovePrevQuiz}>
            <Text style={styles.answerSubmitButtonText}>이전문제</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

export default AnswerButton;

const styles = StyleSheet.create({
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
});
