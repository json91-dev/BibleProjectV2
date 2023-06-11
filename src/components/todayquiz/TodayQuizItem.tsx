import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TodayQuizItemHighlightText from '../common/QuizItemHighlightText';
import { makeBlankQuizSentence } from '../../utils';

type TodayQuizItemType = {
  isOpened: boolean;
  quizData: any;
  isOpenedCheck?: boolean;
};

const TodayQuizItem = ({ quizData, isOpened }) => {
  const { quizVersePath, quizWord, quizSentence } = quizData;

  // 퀴즈에 대해 중간 공백을 만들어주는 함수
  const blankQuizSentence = useMemo(() => {
    return makeBlankQuizSentence(quizSentence, quizWord);
  }, [quizSentence, quizWord]);

  return (
    <View style={styles.container}>
      <View style={styles.quizHeaderContainer}>
        <Text style={styles.quizIndexText}>빈칸에 들어갈 단어는?</Text>
        <Text style={styles.quizVersePathText}>{quizVersePath}</Text>
      </View>
      <View style={styles.quizMainContainer}>
        {isOpened ? (
          <TodayQuizItemHighlightText quizSentence={quizSentence} quizWord={quizWord} />
        ) : (
          <Text style={styles.quizSentenceText}>{blankQuizSentence}</Text>
        )}
        {isOpened ? <Text style={styles.answerText}>정답은 "{quizWord}" 입니다.</Text> : <View></View>}
      </View>
    </View>
  );
};

export default React.memo<TodayQuizItemType>(TodayQuizItem);

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginBottom: 10,
    width: '90%',
    marginLeft: '5%',
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
    marginBottom: 8,
    marginTop: 26,
    color: '#F9DA4F',
    fontSize: 20,
  },
});
