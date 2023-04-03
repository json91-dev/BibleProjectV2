import {Text} from 'react-native';
import React from 'react';

const QuizTimer = ({timerText}) => {
  return (
    <Text
      style={{
        textAlign: 'center',
        fontSize: 44,
        marginTop: 20,
        fontWeight: 'normal',
      }}>
      {timerText}
    </Text>
  );
};

export default QuizTimer;
