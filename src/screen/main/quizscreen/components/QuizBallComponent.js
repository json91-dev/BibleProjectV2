import React, {Component} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';

function replaceAll(str, searchStr, replaceStr) {
  return str.split(searchStr).join(replaceStr);
}

export default class QuizBallComponent extends Component {
  state = {
    quizBallState: [0, -1, 1, 1, 0],
  };

  QuizBall = () => {
    const {quizBallState} = this.props;

    // -1일 => 풀기 전  // 0 => 틀림 // 1 => 정답
    const quizBall = this.props.quizBallState.map((num, index) => {
      let CurrentQuizBall;
      switch (num) {
        case -1:
          return (
            <Image
              key={num.toString() + index.toString()}
              style={styles.ballImage}
              source={require('/assets/ic_quizball_none.png')}
            />
          );
          break;
        case 0:
          return (
            <Image
              key={num.toString() + index.toString()}
              style={styles.ballImage}
              source={require('/assets/ic_quizball_x.png')}
            />
          );
          break;
        case 1:
          return (
            <Image
              key={num.toString() + index.toString()}
              style={styles.ballImage}
              source={require('/assets/ic_quizball_o.png')}
            />
          );
          break;
        default:
          return <View> key={num.toString() + index.toString()}</View>;
          break;
      }
    });

    return quizBall;
  };

  render() {
    return <View style={styles.container}>{this.QuizBall()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    flexDirection: 'row',
  },

  ballImage: {
    resizeMode: 'contain',
    width: 35,
    height: 35,
    marginLeft: 5,
    marginRight: 5,
  },
});
