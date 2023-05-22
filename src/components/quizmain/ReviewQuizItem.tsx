import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import QuizItemHighlightText from '../common/QuizItemHighlightText';
import { makeBlankQuizSentence } from '../../utils';

const ReviewQuizItem = ({ index, quizVersePath, quizWord, quizSentence }) => {
  const [isOpenAnswer, setIsOpenAnswer] = useState<boolean>(false);

  const showBlankQuiz = useCallback(() => {
    setIsOpenAnswer(true);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.quizHeaderContainer}>
        <Text style={styles.quizIndexText}>세례문답 복습 {index}/5</Text>
        <Text style={styles.quizVersePathText}>{quizVersePath}</Text>
      </View>
      <View style={styles.quizMainContainer}>
        {isOpenAnswer ? (
          <QuizItemHighlightText quizSentence={quizSentence} quizWord={quizWord} />
        ) : (
          <Text style={styles.quizSentenceText}>{makeBlankQuizSentence(quizSentence, quizWord)}</Text>
        )}

        {isOpenAnswer ? (
          <Text style={styles.answerText}>정답은 "{quizWord}" 입니다.</Text>
        ) : (
          <TouchableOpacity style={styles.answerButton} onPress={showBlankQuiz}>
            <Text>정답보기</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ReviewQuizItem;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },

  quizHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  quizIndexText: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  quizVersePathText: {
    fontSize: 14,
  },

  quizMainContainer: {
    marginTop: 20,
    backgroundColor: '#333333',
    borderRadius: 10,
    padding: 10,
    paddingTop: 12,
    paddingBottom: 10,
  },

  quizSentenceText: {
    marginTop: 5,
    color: 'white',
  },

  answerButton: {
    borderWidth: 1,
    marginTop: 30,
    backgroundColor: '#F9DA4F',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },

  answerText: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 10,
    marginTop: 26,
    color: '#F9DA4F',
    fontSize: 20,
  },
});
