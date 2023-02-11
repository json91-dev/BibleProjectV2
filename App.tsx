import React, {useEffect} from 'react';
import Root from './src/screen/RootNavigator';
import admob, {MaxAdContentRating} from '@react-native-firebase/admob';

const App = () => {
  useEffect(() => {
    admob()
      .setRequestConfiguration({
        // 최대 광고 컨텐트 등급 지정
        maxAdContentRating: MaxAdContentRating.PG,
        // true인 경우 아동에 대한 컨텐츠 광고 올라옴.
        tagForChildDirectedTreatment: true,
        // true인 경우 동의 연령 미만 사용자에게 적합한 방식으로 광고 요청 처
        tagForUnderAgeOfConsent: true,
      })
      .then(() => {
        console.log('adMob 초기화 성공');
      });
  });

  return <Root />;
};

export default App;
