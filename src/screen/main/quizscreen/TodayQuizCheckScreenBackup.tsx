import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Keyboard, SafeAreaView } from 'react-native';

import QuizBall from '../../../components/common/QuizBall';
import TodayQuizItem from '../../../components/todayquiz/TodayQuizItem';
import { getItemFromAsync, setItemToAsync } from '../../../utils';

export default class TodayQuizCheckScreen extends Component {
  state = {
    currentQuizBallState: [-1, -1, -1, -1, -1],
    quizAnswerTextArray: [],
    pageState: 0,
    isFocusTextInput: false,
    textInputText: '',
    isOpenAnswer: true,
    quizData: null,
    curPageQuizData: null,
  };

  componentDidMount() {
    // 해당 부분을 서버에서 전달받도록 수정..
    // 여기서는 reviewQuizData로 전달받음.
    // const data = [
    //   {
    //     quizVerse: '역대하 5장 3절',
    //     quizSentence: '솔로몬이 여호와의 전을 위하여 만드는 모든 것을 마친지라 이에 그 부친 다윗이 드린 은과 금과 모든 기구를 가져다가 하나님의 전 곳간에 두었더라',
    //     quizWord: '다윗',
    //   },
    //   {
    //     quizVerse: '아가 8장 11절',
    //     quizSentence: '솔로몬이 바알하몬에 포도원이 있어 지키는 자들에게 맡겨두고 그들로 각기 그 실과를 인하여서 은 일천을 바치게 하였구나',
    //     quizWord: '포도원',
    //   },
    //   {
    //     quizVerse: '베드로후서 3장 5절',
    //     quizSentence: '이는 하늘이 옛적부터 있는 것과 땅이 물에서 나와 물로 성립한 것도 하나님의 말씀으로 된 것을 저희가 부러 잊으려 함이로다',
    //     quizWord: '물',
    //   },
    //   {
    //     quizVerse: '요한계시록 6장 8절',
    //     quizSentence: '내가 보매 청황색 말이 나오는데 그 탄 자의 이름은 사망이니 음부가 그 뒤를 따르더라 저희가 땅 사분 일의 권세를 얻어 검과 흉년과 사망과 땅의 짐승으로써 죽이더라',
    //     quizWord: '사망',
    //   },
    //   {
    //     quizVerse: '갈라디아서 5장 13절',
    //     quizSentence: '형제들아 너희가 자유를 위하여 부르심을 입었으나 그러나 그 자유로 육체의 기회를 삼지 말고 오직 사랑으로 서로 종 노릇 하라',
    //     quizWord: '사랑',
    //   }
    // ];
    //
    // this.setState({
    //   quizData: data,
    //   curPageQuizData: data[0],
    // });
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
  }

  render() {
    const { pageState } = this.state;
    // 버튼이 포커스되면 searchView를 보여줌

    const onMoveNextQuiz = () => {
      const { pageState, quizData, curPageQuizData } = this.state;

      this.setState(prevState => {
        return {
          isOpenAnswer: true,
          curPageQuizData: quizData[pageState + 1],
          pageState: prevState.pageState + 1,
        };
      });
    };

    const onMovePrevQuiz = () => {
      const { pageState, quizData, curPageQuizData } = this.state;

      this.setState(prevState => {
        return {
          isOpenAnswer: true,
          curPageQuizData: quizData[pageState - 1],
          pageState: prevState.pageState - 1,
        };
      });
    };

    // TODO: quizAnswerTextArray를 AsynStorage에 저장.
    // reviewQuizDataList => 다음날이 되어 퀴즈를 시작할때 풀어야 하는 복습 문제들에 대한 정보를 저장함.
    // isCompleteTodayQuiz => 오늘의 퀴즈를 모두 풀었는지에 대한 정보를 확인함.
    // 모두 풀었을때 => 결과창 + 타이머 + 푼 문제 복습 링크
    // 안풀었을때 => 퀴즈 시작 링크 + 이전문제 복습
    const onCompleteTodayQuiz = () => {
      const { quizData } = this.state;
      const setReviewItem = setItemToAsync('reviewQuizDataList', quizData);
      const setTodayQuizComplete = setItemToAsync('isCompleteTodayQuiz', true);

      Promise.all([setReviewItem, setTodayQuizComplete]).then(function (result) {
        console.log(result);
      });
    };

    /**
     * 컴포넌트 분리.
     */
    const TodayQuizTitleView = () => {
      const { isFocusTextInput, currentQuizBallState } = this.state;
      if (!isFocusTextInput) {
        return (
          <View style={styles.todayQuizTitleView}>
            <Text style={styles.todayQuizTitleText}>오늘의 세례문답 {pageState + 1}/5</Text>
            <QuizBall quizBallState={currentQuizBallState} />
          </View>
        );
      } else {
        return null;
      }
    };

    // 퀴즈의 내용과 성경구절을 알려주는 퀴즈 컴포넌트.
    // data를 올바르게 받아왔을때 todayQuiz컴포넌트를 열어준다.
    // 유저가 정답을 입력한 경우 props로 정답확인을 알려준다.
    const ShowTodayQuizItemComponent = () => {
      const { curPageQuizData } = this.state;
      if (curPageQuizData) {
        return <TodayQuizItem quizData={this.state.curPageQuizData} isOpened={true} isOpenedCheck={true} />;
      } else {
        return null;
      }
    };

    // 정답에 대해 유저의 입력을 확인시켜주는 컴포넌트.
    const ConfirmCurrentQuizAnswer = () => {
      const { isOpenAnswer } = this.state;
      let { pageState, quizAnswerTextArray } = this.state;

      const quizAnswerText = quizAnswerTextArray[pageState];

      if (isOpenAnswer) {
        return (
          <View style={styles.confirmAnswerView}>
            <Text style={styles.confirmAnswerLabel}>입력하신 정답은</Text>
            <Text style={styles.confirmAnswerText}>{quizAnswerText}</Text>
          </View>
        );
      }
      {
        return null;
      }
    };

    // 정답제출 버튼 및 다음 화면으로 이동 버튼에 대한 컴포넌트
    // => 수정 : 다음 , 이전 + 다음, 이전 으로 수정해야한다. (완료)
    const AnswerButton = () => {
      const { pageState } = this.state;

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

    return (
      <SafeAreaView style={styles.container} contentContainerStyle={{ justifyContent: 'center' }}>
        <View style={styles.contentContainer}>
          <View style={styles.closeView}>
            <TouchableOpacity style={styles.closeButton} onPress={this.props.navigation.goBack}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>

          {TodayQuizTitleView()}
          {ShowTodayQuizItemComponent()}
          {ConfirmCurrentQuizAnswer()}
          {AnswerButton()}
        </View>
      </SafeAreaView>
    );
  }
}

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
