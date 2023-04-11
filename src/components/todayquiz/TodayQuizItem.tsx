import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { replaceAll } from '../../utils';
import TodayQuizItemHighlightText from './TodayQuizItemHighlightText';

type TodayQuizItemType = {
  isOpened: boolean;
  quizData: any;
  isOpenedCheck?: boolean;
};

const TodayQuizItem = ({ quizData, isOpened }) => {
  const [isOpenAnswer, setIsOpenAnswer] = useState(false);
  const { quizVerse, quizWord, quizSentence } = quizData;

  // 퀴즈의 정답제출이 끝나거나 퀴즈 화면이 이동할때를 위해
  // 넘어온 isOpened props 를 현재 isOpenAnswer state 로 동기화 (ex: getDerivedStateFromProps)
  if (isOpened !== isOpenAnswer) {
    setIsOpenAnswer(isOpened);
  }

  // 퀴즈에 대해 중간 공백을 만들어주는 함수
  const makeBlankQuizSentence = useMemo(() => {
    let dummy = '____________________________________________________';
    let blank = dummy.substr(dummy.length - quizWord.length * 2);
    let blankQuizSentence = replaceAll(quizSentence, quizWord, blank);
    return blankQuizSentence;
  }, [quizData]);

  return (
    <View style={styles.container}>
      <View style={styles.quizHeaderContainer}>
        <Text style={styles.quizIndexText}>빈칸에 들어갈 단어는?</Text>
        <Text style={styles.quizVerseText}>{quizVerse}</Text>
      </View>
      <View style={styles.quizMainContainer}>
        {isOpenAnswer ? (
          <TodayQuizItemHighlightText quizSentence={quizSentence} quizWord={quizWord} />
        ) : (
          <Text style={styles.quizSentenceText}>{makeBlankQuizSentence}</Text>
        )}
        {isOpenAnswer ? <Text style={styles.answerText}>정답은 "{quizWord}" 입니다.</Text> : <View></View>}
      </View>
    </View>
  );
};

export default React.memo<TodayQuizItemType>(TodayQuizItem, (prevProps, nextProps) => {
  // isOpened가 달라졌을때에만 렌더링.
  if (prevProps.isOpened !== nextProps.isOpened) {
    return true;
  }
  // isOpendCheck로 props가 true로 넘어왔을때에도 렌더링 적용
  else if (nextProps.isOpenedCheck) {
    return true;
  } else {
    return false;
  }
});

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

  quizVerseText: {
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
