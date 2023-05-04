import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, Text, Image, TouchableOpacity, View } from 'react-native';
import ReviewQuizItem from '../../../components/quizmain/ReviewQuizItem';
import { getDateStringByFormat, getItemFromAsync, setItemToAsync } from '../../../utils';
import QuizBall from '../../../components/common/QuizBall';
import QuizTimer from '../../../components/quizmain/QuizTimer';
let timer = null; // 전역 타이머 설정

const QuizScreen = ({ navigation }) => {
  const [isCompleteTodayQuiz, setIsCompleteTodayQuiz] = useState(false); // 오늘의 퀴즈를 풀었으면 true
  const [isGiveUpTodayQuiz, setIsGiveUpTodayQuiz] = useState(false); // 오늘의 퀴즈를 포기하였다면 true
  const [reviewQuizData, setReviewQuizData] = useState([]); // 오늘의 푼 퀴즈에 대한 복습문제
  const [timerText, setTimerText] = useState('waiting...'); // 타이머
  const [currentQuizBallState, setCurrentQuizBallState] = useState([-1, -1, -1, -1, -1]); // 유저가 입력한 정답의 상태볼에 대한 배열값.
  const [todayQuizAnswerList, setTodayQuizAnswerList] = useState(null); // 유저가 입력한 퀴즈의 정답 목록.

  // 현재 날짜를 확인한뒤 새로운 날짜일때 퀴즈 상태를 초기화한다.
  // - 오늘의 퀴즈를 풀었는지 : false
  // - 오늘의 퀴즈의 포기를 눌렀는지 : false
  const initializeQuizState = useCallback(async () => {
    // 현재 날짜가 바뀌었는지(어제날짜와 다른지) 확인한 뒤 새로운 날짜일때 퀴즈화면의 상태를 바꿔준다.
    // 간단하게 여기서는 날짜의 형식을 yyyyMMdd 의 정수로만 표시한뒤 크기를 비교하는 방법으로 날짜를 비교한다.
    const quizDate = await getItemFromAsync<number>('quizDate');
    if (quizDate !== null) {
      const nowDate = parseInt(getDateStringByFormat(new Date(), 'yyyyMMdd'));

      // 퀴즈를 푼 날짜보다 지난 날짜가 되면, 퀴즈 상태를 갱신.
      // quizData는 complete나 giveup시 갱신된다.
      // 즉 complete나 giveup을 누르면 nowDate = quizDate와 같기 때문에 무조건 타이머 화면이 나오게 된다
      // 하지만 다음날이 되면 nowDate는 quizDate보다 1일 증가하므로 복습과 링크화면이 나오게 된다.
      if (nowDate > quizDate) {
        console.log('오늘의 퀴즈로 갱신');
        // await setItemToAsync('quizDate', nowDate);
        await setItemToAsync('isCompleteTodayQuiz', false);
        await setItemToAsync('isGiveUpTodayQuiz', false);
      }
    }

    /** TODO: quizState의 상태를 JSON으로 저장하는게 좋음 => 추후 리펙토링 **/
    const isCompleteTodayQuiz = await getItemFromAsync<boolean>('isCompleteTodayQuiz');
    const isGiveUpTodayQuiz = await getItemFromAsync<boolean>('isGiveUpTodayQuiz');
    const reviewQuizDataList = await getItemFromAsync<any[]>('reviewQuizDataList');
    const getTodayQuizAnswerList = await getItemFromAsync<any[]>('todayQuizAnswerList');
    const todayQuizBallState = await getItemFromAsync<any[]>('todayQuizBallState');

    // 문제를 한번도 풀지 않았거나, 다음날이 되었을때
    if (isCompleteTodayQuiz === null && isGiveUpTodayQuiz === null) {
      setIsCompleteTodayQuiz(false);
      setIsGiveUpTodayQuiz(false);
      setReviewQuizData(reviewQuizDataList);
    }

    // 오늘의 퀴즈를 모두 풀었거나, 오늘의 퀴즈를 포기한 경우
    // 퀴즈를 푼 이후 => 결과창, 타이머, 내가 푼 성경 복습
    else if (isCompleteTodayQuiz === true || isGiveUpTodayQuiz === true) {
      setIsCompleteTodayQuiz(isCompleteTodayQuiz);
      setIsGiveUpTodayQuiz(isGiveUpTodayQuiz);
      setReviewQuizData(reviewQuizDataList);
      setCurrentQuizBallState(todayQuizBallState);
    }

    // 오늘의 퀴즈를 오늘 풀지 않은 유저의 경우.
    // 퀴즈를 아직 풀기 전 => 퀴즈 시작 버튼, 이전 문제에 대한 복습.
    else if (isCompleteTodayQuiz === false && isGiveUpTodayQuiz === false) {
      setIsCompleteTodayQuiz(false);
      setIsGiveUpTodayQuiz(false);
      setReviewQuizData(reviewQuizDataList);
    }
  }, []);

  const CountDownQuizTimer = useCallback(dt => {
    const end = new Date(dt);
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    let zeroSet = function (i) {
      return (i < 10 ? '0' : '') + i;
    };

    const showRemaining = () => {
      const now = new Date();
      const distance = end - now;

      // 시간 종료시
      if (distance < 0) {
        clearInterval(timer);
        // 종류 문구 선언
        // 이곳에 다음 퀴즈를 푸는 버튼을 만들어준다. 해당버튼을 눌렀을시 오늘의 퀴즈(다음날)로 이동한다.
        initializeQuizState().then();
        return;
      }

      const days = Math.floor(distance / day);
      const hours = Math.floor((distance % day) / hour);
      const minutes = Math.floor((distance % hour) / minute);
      const seconds = Math.floor((distance % minute) / second);
      const _timerText = `${zeroSet(hours)}:${zeroSet(minutes)}:${zeroSet(seconds)}`;
      setTimerText(_timerText);
    };

    clearInterval(timer);
    timer = setInterval(showRemaining, 1000);
  }, []);

  useEffect(() => {
    if (timer) {
      clearInterval(timer);
    }

    let end = new Date(new Date().setHours(24, 0, 0));
    CountDownQuizTimer(end);

    // 현재 Screen이 화면에서 보일때 (focus) 실행될수 있도록 이벤트를 등록하는 과정
    const unsubscribe = navigation.addListener('focus', () => {
      initializeQuizState().then();
    });

    return () => {
      clearInterval(timer);
      // navigation의 focus를 해지 (함수를 한번 호출하면 unsubscribe 됨)
      unsubscribe();
    };
  }, []);

  return (
    <>
      {isCompleteTodayQuiz && (
        <SafeAreaView style={styles.completeQuizContainer} contentContainerStyle={{ justifyContent: 'center' }}>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate('TodayQuizCheckScreen')}>
              <Image style={styles.quizResultQuestionImage} source={require('../../../assets/ic_question_quiz_result.png')} />
            </TouchableOpacity>
            <Image style={styles.quizResultJesusImage} source={require('../../../assets/ic_jesus_weird.png')} />
            <Text style={styles.titleText}>오늘의 세례문답 성적은</Text>
            <QuizBall quizBallState={currentQuizBallState} />
            <Text style={[styles.titleText, { marginTop: 80 }]}>내일의 세례문답까지.</Text>
            <QuizTimer timerText={timerText} />
          </View>
        </SafeAreaView>
      )}

      {isGiveUpTodayQuiz && (
        <SafeAreaView style={styles.completeQuizContainer} contentContainerStyle={{ justifyContent: 'center' }}>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate('TodayQuizCheckScreen')}>
              <Image style={styles.quizResultQuestionImage} source={require('../../../assets/ic_question_quiz_result.png')} />
            </TouchableOpacity>
            <Image style={styles.quizResultJesusImage} source={require('../../../assets/ic_jesus_sad.png')} />
            <Text style={styles.titleText}>
              오늘의 세례문답{'\n'}퀴즈를 포기하셨네요.{'\n'}내일의 세례문답까지.
            </Text>
            <QuizTimer timerText={timerText} />
          </View>
        </SafeAreaView>
      )}

      {!isCompleteTodayQuiz && !isGiveUpTodayQuiz && reviewQuizData === null && (
        <SafeAreaView style={styles.container}>
          <View style={{ borderWidth: 1 }}>
            <Image style={styles.titleImage} source={require('../../../assets/ic_jesus.png')} />
            <Text style={styles.titleText}>
              오늘의 세례문답{'\n'}퀴즈를 시작할 준비가{'\n'}되셨나요?
            </Text>
            <TouchableOpacity style={styles.quizButton} onPress={() => navigation.navigate('TodayQuizScreen')}>
              <Text style={styles.quizButtonText}>오늘의 세례문답 시작!</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}

      {!isCompleteTodayQuiz && !isGiveUpTodayQuiz && reviewQuizData?.length > 0 && (
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <View
              style={{
                borderBottomWidth: 1,
                marginTop: 10,
                paddingBottom: 15,
                alignItems: 'flex-end',
                paddingRight: 16,
                borderBottomColor: '#CCCCCC',
              }}>
              <TouchableOpacity onPress={() => navigation.navigate('TodayQuizScreen')}>
                <Text style={{ fontSize: 16 }}>건너뛰기</Text>
              </TouchableOpacity>
            </View>

            <Image style={styles.todayQuizReviewImage} source={require('../../../assets/ic_today_quiz_review.png')} />
            {reviewQuizData?.map((item, index) => {
              return (
                <ReviewQuizItem
                  key={index + item.quizWord}
                  index={index + 1}
                  quizVerse={item.quizVerse}
                  quizWord={item.quizWord}
                  quizSentence={item.quizSentence}
                />
              );
            })}

            <Image style={styles.titleImage} source={require('../../../assets/ic_jesus.png')} />
            <Text style={styles.titleText}>
              오늘의 세례문답{'\n'}퀴즈를 시작할 준비가{'\n'}되셨나요?
            </Text>
            <TouchableOpacity style={styles.quizButton} onPress={() => navigation.navigate('TodayQuizScreen')}>
              <Text style={styles.quizButtonText}>오늘의 세례문답 시작!</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};

export default QuizScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollViewContainer: {
    flex: 1,
    backgroundColor: 'white',
  },

  completeQuizContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    paddingBottom: '20%',
    backgroundColor: 'white',
  },

  quizResultQuestionImage: {
    width: 180,
    height: 120,
    resizeMode: 'contain',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 30,
    marginBottom: -20,
  },

  quizResultJesusImage: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  titleImage: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 40,
  },

  todayQuizReviewImage: {
    width: 180,
    height: 100,
    resizeMode: 'contain',
    marginTop: 38,
    marginLeft: 30,
    marginBottom: 40,
  },

  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 24,
  },

  quizButton: {
    width: 300,
    height: 60,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#F9DA4F',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 50,
  },

  quizButtonText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});
