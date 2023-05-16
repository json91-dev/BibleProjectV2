
## The Bible 프로젝트 (React Native)

아래와 같은 기능들을 제공하는 Simple한 성경책 어플 개발

  * 성경 읽기
  * 오늘의 문제를 풀고 성경 퀴즈 풀기
  * 성경 메모, 밑줄로 기록
  * 오늘의 성경 한구절 읽기
  
#### metro 서버 실행

```shell
npm run android
npm run ios
```


#### firebase functions 배포

1. firebase cli 설치
```shell
npm install -g firebase-tools
```

2. firebase 로그인
```shell
firebase login --reauth
```

3. firebase functions 배포
```shell
cd /FirebaseFunctions
firebase deploy --only functions
```

