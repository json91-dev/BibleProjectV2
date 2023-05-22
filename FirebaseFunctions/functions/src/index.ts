import axios, { AxiosResponse } from 'axios';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const moment = require('moment-timezone');
const MATGIM_AI_TOKEN: string = functions.config().matgim_ai.token;
// 성경 랜덤
const getRandomBook = (): number => {
  return Math.floor(Math.random() * 66) + 1;
};

// 성경 장 랜덤
const getRandomChapter = (book: number): number => {
  const chapterCount = [
    50, 40, 27, 36, 34, 24, 21, 4, 31, 24, 22, 25, 29, 36, 10, 13, 10, 42, 150, 31, 12, 8, 66, 52, 5, 48, 12, 14, 3, 9, 1, 4, 7, 3, 3, 3, 2,
    14, 4, 28, 16, 24, 21, 28, 16, 16, 13, 6, 6, 4, 4, 5, 3, 6, 4, 3, 1, 13, 5, 5, 3, 5, 1, 1, 1, 22,
  ];
  return Math.floor(Math.random() * chapterCount[book - 1]) + 1;
};

const getRandomWord = (wordArray: string[]): string => {
  const randomIndex = Math.floor(Math.random() * wordArray.length);
  const randomWord = wordArray[randomIndex];
  return randomWord;
};

interface todayVerse {
  content: string;
  createdAt: Date;
  versePath: string;
}

interface todayQuiz {
  quizWord: string;
  quizSentence: string;
  createdAt: Date;
  quizVersePath: string;
}

interface postKeywordApiResponse {
  success: boolean;
  result: {
    sentences: string[];
    keywords: [string, number][];
  };
}

async function fetchKeywordsApi(sentences: string) {
  try {
    const url = 'https://api.matgim.ai/54edkvw2hn/api-keyword';
    const response: AxiosResponse<postKeywordApiResponse> = await axios.post<postKeywordApiResponse>(
      url,
      { document: sentences },
      {
        headers: {
          'x-auth-token': `${MATGIM_AI_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (error) {
    // 에러 처리
    console.error('POST 요청 중 오류가 발생했습니다:', error);
    throw error;
  }
}

const getMaxVerseCountFromFirestore = (book, chapter) => {
  return new Promise<number>(async (resolve, reject) => {
    try {
      let querySnapshot = await db.collection('bibleVerse').where('book', '==', book).where('chapter', '==', chapter).get();
      const maxVerseCount = querySnapshot.size;
      resolve(maxVerseCount);
    } catch (e) {
      reject(e);
    }
  });
};

const getTodayVerseDataFromFirestore = (book: number, chapter: number, verse: number) => {
  return new Promise<todayVerse>(async (resolve, reject) => {
    try {
      const querySnapshot = await db
        .collection('bibleVerse')
        .where('book', '==', book)
        .where('chapter', '==', chapter)
        .where('verse', '==', verse)
        .get();

      if (querySnapshot.size > 0) {
        const doc = querySnapshot.docs[0];
        const versePath = doc.id.replaceAll('_', ' ');
        const content = doc.data().content;
        const date = new Date(); // 현재 시간을 기본 날짜로 설정하거나 원하는 날짜를 지정

        resolve({
          versePath: versePath,
          content: content,
          createdAt: date,
        });
      } else {
        reject('No documents found.');
      }
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * 오늘의 성경을 매일 정각 12:00에 만드는 cronjob 함수
 * 1. 랜덤으로 만든 성경책(book)과 장(chatper)과 일치하는 절(Verse)들을 모두 가져옴
 * 2. 절(Verse)의 최대 갯수 추출
 * 3. 최대갯수를 통해 절에 대한 랜덤 절(Verse)을 얻음
 * 4. 각각의 성경, 장, 절 에 대한 랜덤 번호를 통해 오늘의 성경의 정보를 생성하고 DB에 update
 */
exports.setRandomVerseByEveryday = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('Asia/Seoul')
  .onRun(async () => {
    try {
      const book = getRandomBook();
      const chapter = getRandomChapter(book);

      const maxVerseCount = await getMaxVerseCountFromFirestore(book, chapter);
      const randomVerse = Math.floor(Math.random() * maxVerseCount - 1) + 1;
      const todayVerse = await getTodayVerseDataFromFirestore(book, chapter, randomVerse);
      const seoulDayString = moment().tz('Asia/Seoul').format('YYYY-MM-DD');
      db.collection('todayVerse')
        .doc(seoulDayString)
        .set({
          versePath: todayVerse.versePath,
          content: todayVerse.content,
          createdAt: new Date(),
        })
        .then(() => {
          console.log('오늘의 성경 입력 성공');
        });
    } catch (e) {
      console.log(e);
    }
  });

const getTodayQuizDataFromFirestore = (book, chapter, verse) => {
  return new Promise<todayQuiz>(async (resolve, reject) => {
    try {
      console.log(book, chapter, verse);

      const querySnapshot = await db
        .collection('bibleVerse')
        .where('book', '==', book)
        .where('chapter', '==', chapter)
        .where('verse', '==', verse)
        .get();

      console.log(querySnapshot);
      if (querySnapshot.size > 0) {
        const doc = querySnapshot.docs[0];
        const versePath = doc.id.replaceAll('_', ' ');
        const content = doc.data().content;
        const date = new Date(); // 현재 시간을 기본 날짜로 설정하거나 원하는 날짜를 지정

        resolve({
          quizWord: '',
          quizVersePath: versePath,
          quizSentence: content,
          createdAt: date,
        });
      } else {
        reject('No documents found.');
      }
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * 오늘의 퀴즈 5문제를 매일 정각 12:00에 만드는 cronjob 함수
 * 1. 랜덤으로 만든 성경책(book)과 장(chatper)과 일치하는 절(Verse)들을 모두 가져옴
 * 2. 절(Verse)의 최대 갯수 추출
 * 3. 랜덤 퀴즈 5개를 만듬
 * 4. 랜덤 퀴즈 5개의 각각의 문장을 합쳐서 matgim 서버로 보내서 키워드들 추출
 * 5. 각각의 키워드들을 통해 각각의 랜덤퀴즈 5개의 문제를 만듬
 * 6. Firebase DB에 update
 */
exports.setRandomTodayQuizByEveryday = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('Asia/Seoul')
  .onRun(async () => {
    try {
      const maxQuizCount = 5;
      const todayQuizList: todayQuiz[] = [];
      const sentences = [];
      for (const {} of Array(maxQuizCount).fill('')) {
        const book = getRandomBook();
        const chapter = getRandomChapter(book);
        const maxVerseCount = await getMaxVerseCountFromFirestore(book, chapter);
        const randomVerse = Math.floor(Math.random() * maxVerseCount - 1) + 1;
        const todayQuiz = await getTodayQuizDataFromFirestore(book, chapter, randomVerse);
        todayQuizList.push(todayQuiz);
        sentences.push(todayQuiz.quizSentence);
      }

      const data = await fetchKeywordsApi(sentences.join(''));
      const keywords = data.result.keywords.map(item => item[0]);
      for (let i = 0; i < todayQuizList.length; i++) {
        const includedKeywords = [];
        const quizSentence = todayQuizList[i].quizSentence;
        keywords.forEach(word => {
          if (quizSentence.includes(word)) {
            includedKeywords.push(word);
          }
        });
        todayQuizList[i].quizWord = getRandomWord(includedKeywords);
      }

      const seoulDayString = moment().tz('Asia/Seoul').format('YYYY-MM-DD');
      db.collection('todayQuiz')
        .doc(seoulDayString)
        .set({ todayQuiz: todayQuizList })
        .then(() => {
          console.log('오늘의 퀴즈 입력 성공');
        });
    } catch (e) {
      console.error(e);
    }
  });
