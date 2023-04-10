import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';

const TodayQuizItemHighlightText = ({ quizSentence, quizWord }) => {
  const [resultTextArray, setResultTextArray] = useState([]);

  useEffect(() => {
    let splitTextArray;
    let result = [];
    try {
      splitTextArray = quizSentence.split(quizWord);
      splitTextArray.map((item, index) => {
        if (index > 0 && index < splitTextArray.length) {
          result.push(quizWord);
        }
        result.push(item);
      });
      setResultTextArray(result);
    } catch (err) {
      console.log(err);
      return;
    }
  }, [quizSentence, quizWord]);

  return (
    <Text style={{ marginTop: 5 }}>
      {resultTextArray.map((item, index) => {
        if (item === quizWord) {
          return (
            <Text key={index + item} style={{ color: '#F9DA4F' }}>
              {item}
            </Text>
          );
        } else {
          return (
            <Text key={index + item} style={{ color: 'white' }}>
              {item}
            </Text>
          );
        }
      })}
    </Text>
  );
};

export default React.memo(TodayQuizItemHighlightText);
