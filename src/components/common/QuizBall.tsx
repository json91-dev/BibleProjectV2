import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { QUIZ_BEFORE, QUIZ_FAIL, QUIZ_SUCCESS } from '../../constraints';

const QuizBall = ({ quizBallState }) => {
  return (
    <View style={styles.container}>
      {quizBallState.map((num, index) => {
        switch (num) {
          case QUIZ_BEFORE: {
            return (
              <Image
                key={num.toString() + index.toString()}
                style={styles.ballImage}
                source={require('../../assets/ic_quizball_none.png')}
              />
            );
          }

          case QUIZ_FAIL: {
            return (
              <Image key={num.toString() + index.toString()} style={styles.ballImage} source={require('../../assets/ic_quizball_x.png')} />
            );
          }

          case QUIZ_SUCCESS: {
            return (
              <Image key={num.toString() + index.toString()} style={styles.ballImage} source={require('../../assets/ic_quizball_o.png')} />
            );
          }

          default: {
            return <View> key={num.toString() + index.toString()}</View>;
          }
        }
      })}
    </View>
  );
};

export default QuizBall;

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
