import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

function replaceAll(str, searchStr, replaceStr) {
  return str.split(searchStr).join(replaceStr);
}

export default class ReviewQuizItem extends Component {
  state = {
    isOpenAnswer: false,
  };

  // 성경 텍스트 문장에 공백을 만들어 반환하는 메서드
  makeBlankQuizSentence = (quizSentence, quizWord) => {
    let dummy = '____________________________________________________';
    let blank = dummy.substr(dummy.length - quizWord.length * 2);
    let blankQuizSentence = replaceAll(quizSentence, quizWord, blank);
    return blankQuizSentence;
  };

  // 정답을 눌렀을때 공백을 없애주고 정답 문장 <Text>를 반환하는 메서드
  highlightText = (quizSentence, quizWord) => {
    let splitTextArray;
    let resultTextArray = [];
    try {
      splitTextArray = quizSentence.split(quizWord);
      splitTextArray.map((item, index) => {
        if (index > 0 && index < splitTextArray.length) {
          resultTextArray.push(quizWord);
        }
        resultTextArray.push(item);
      });
    } catch (err) {
      console.log(err);
      return;
    }
    return (
      <Text style={{marginTop: 5}}>
        {resultTextArray.map(item => {
          if (item === quizWord) {
            return <Text style={{color: '#F9DA4F'}}>{item}</Text>;
          } else {
            return <Text style={{color: 'white'}}>{item}</Text>;
          }
        })}
      </Text>
    );
  };

  showBlankQuiz() {
    this.setState({
      isOpenAnswer: true,
    });
  }

  render() {
    // const {index, quizVerse, quizWord, quizSentence} = this.props;
    const {index, quizVerse, quizWord, quizSentence} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.quizHeaderContainer}>
          <Text style={styles.quizIndexText}>세례문답 복습 {index}/5</Text>
          <Text style={styles.quizVerseText}>{quizVerse}</Text>
        </View>
        <View style={styles.quizMainContainer}>
          {this.state.isOpenAnswer ? (
            this.highlightText(quizSentence, quizWord)
          ) : (
            <Text style={styles.quizSentenceText}>
              {this.makeBlankQuizSentence(quizSentence, quizWord)}
            </Text>
          )}
          {this.state.isOpenAnswer ? (
            <Text style={styles.answerText}>정답은 "{quizWord}" 입니다.</Text>
          ) : (
            <TouchableOpacity
              style={styles.answerButton}
              onPress={this.showBlankQuiz.bind(this)}>
              <Text>정답보기</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

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

  quizVerseText: {
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
