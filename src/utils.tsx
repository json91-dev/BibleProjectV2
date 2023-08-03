import AsyncStorage from '@react-native-async-storage/async-storage';
import SQLite from 'react-native-sqlite-storage';
import { VerseItemList } from './screen/bible/VerseListScreen';

// 문자열이 특정길이 이상일때 ...으로 출력해주는 메서드
export const textLengthOverCut = (txt, len, lastTxt) => {
  if (len == '' || len == null) {
    // 기본값
    len = 30;
  }
  if (lastTxt == '' || lastTxt == null) {
    // 기본값
    lastTxt = '...';
  }
  if (txt.length > len) {
    txt = txt.substr(0, len) + lastTxt;
  }
  return txt;
};

// bookCode에 따라 '구약' || '신약' 문자열 출력
export const getBibleTypeString = (bookCode: number) => {
  if (bookCode >= 1 && bookCode < 40) {
    return '구약';
  } else if (bookCode <= 66) {
    return '신약';
  } else {
    return '올바른 bookCode가 아닙니다.';
  }
};

// 구약, 신약에 대한 타입 출력 => 0이면 구약, 1이면 신약
export const getBibleType = (bookCode: number) => {
  if (bookCode >= 1 && bookCode < 40) {
    return 0;
  } else if (bookCode <= 66) {
    return 1;
  } else {
    return -1;
  }
};

// uuid v4를 랜덤으로 반환
export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// 아무값도 들어있지 않으면 빈 배열을 반환
export const getItemFromAsyncStorage = <T,>(key: string) => {
  return new Promise<T>((resolve, reject) => {
    if (key === null || key === undefined) {
      reject(new Error('key is not exist.'));
    }

    AsyncStorage.getItem(key, (err, result) => {
      if (err) {
        reject(err);
      }

      if (result === null) {
        resolve(null);
      }

      resolve(JSON.parse(result));
    });
  });
};

export const setItemToAsyncStorage = (key: string, value: any) => {
  return new Promise((resolve, reject) => {
    if (key === null || key === undefined) {
      reject(new Error('key is not exist.'));
    }
    AsyncStorage.setItem(key, JSON.stringify(value), error => {
      if (error) {
        reject(error);
      }
      resolve('입력 성공');
    });
  });
};

export const removeItemFromAsyncStorage = key => {
  return new Promise(async (resolve, reject) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      reject(e);
    }
  });
};

type BibleItem = {
  name: string;
  bookName: string;
  bookCode: number;
};

export const getOldBibleItems = (): BibleItem[] => {
  return [
    { name: '창', bookName: '창세기', bookCode: 1 },
    { name: '출', bookName: '출애굽기', bookCode: 2 },
    { name: '레', bookName: '레위기', bookCode: 3 },
    { name: '민', bookName: '민수기', bookCode: 4 },
    { name: '신', bookName: '신명기', bookCode: 5 },
    { name: '수', bookName: '여호수아', bookCode: 6 },
    { name: '삿', bookName: '사사기', bookCode: 7 },
    { name: '룻', bookName: '룻기', bookCode: 8 },
    { name: '삼상', bookName: '사무엘상', bookCode: 9 },
    { name: '삼하', bookName: '사무엘하', bookCode: 10 },
    { name: '왕상', bookName: '열왕기상', bookCode: 11 },
    { name: '왕하', bookName: '열왕기하', bookCode: 12 },
    { name: '대상', bookName: '역대상', bookCode: 13 },
    { name: '대하', bookName: '역대하', bookCode: 14 },
    { name: '스', bookName: '에스라', bookCode: 15 },
    { name: '느', bookName: '느헤미야', bookCode: 16 },
    { name: '에', bookName: '에스더', bookCode: 17 },
    { name: '욥', bookName: '욥기', bookCode: 18 },
    { name: '시', bookName: '시편', bookCode: 19 },
    { name: '잠', bookName: '잠언', bookCode: 20 },
    { name: '전', bookName: '전도서', bookCode: 21 },
    { name: '아', bookName: '아가', bookCode: 22 },
    { name: '사', bookName: '이사야', bookCode: 23 },
    { name: '렘', bookName: '예레미야', bookCode: 24 },
    { name: '애', bookName: '예레미아애가', bookCode: 25 },
    { name: '겔', bookName: '에스겔', bookCode: 26 },
    { name: '단', bookName: '다니엘', bookCode: 27 },
    { name: '호', bookName: '호세아', bookCode: 28 },
    { name: '욜', bookName: '요엘', bookCode: 29 },
    { name: '암', bookName: '아보스', bookCode: 30 },
    { name: '옵', bookName: '오바댜', bookCode: 31 },
    { name: '욘', bookName: '요나', bookCode: 32 },
    { name: '미', bookName: '미가', bookCode: 33 },
    { name: '나', bookName: '나훔', bookCode: 34 },
    { name: '합', bookName: '하박국', bookCode: 35 },
    { name: '습', bookName: '스바냐', bookCode: 36 },
    { name: '학', bookName: '학개', bookCode: 37 },
    { name: '슥', bookName: '스가랴', bookCode: 38 },
    { name: '말', bookName: '말라기', bookCode: 39 },
  ];
};

export const getNewBibleItems = (): BibleItem[] => {
  return [
    { name: '마', bookName: '마태복음', bookCode: 40 },
    { name: '막', bookName: '마가복음', bookCode: 41 },
    { name: '눅', bookName: '누가복음', bookCode: 42 },
    { name: '요', bookName: '요한복음', bookCode: 43 },
    { name: '행', bookName: '사도행전', bookCode: 44 },
    { name: '롬', bookName: '로마서', bookCode: 45 },
    { name: '고전', bookName: '고린도전서', bookCode: 46 },
    { name: '고후', bookName: '고린도후서', bookCode: 47 },
    { name: '갈', bookName: '갈라디아서', bookCode: 48 },
    { name: '엡', bookName: '에베소', bookCode: 49 },
    { name: '빌', bookName: '빌립보서', bookCode: 50 },
    { name: '골', bookName: '골로새서', bookCode: 51 },
    { name: '살전', bookName: '데살로전서', bookCode: 52 },
    { name: '살후', bookName: '데살로후서', bookCode: 53 },
    { name: '딤전', bookName: '디모데전서', bookCode: 54 },
    { name: '딤후', bookName: '디모데후서', bookCode: 55 },
    { name: '딛', bookName: '디도서', bookCode: 56 },
    { name: '몬', bookName: '빌레몬서', bookCode: 57 },
    { name: '히', bookName: '히브리서', bookCode: 58 },
    { name: '약', bookName: '야보고서', bookCode: 59 },
    { name: '벧전', bookName: '베드로전서', bookCode: 60 },
    { name: '벧후', bookName: '베드로후서', bookCode: 61 },
    { name: '요1', bookName: '요한1서', bookCode: 62 },
    { name: '요2', bookName: '요한2서', bookCode: 63 },
    { name: '요3', bookName: '요한3서', bookCode: 64 },
    { name: '유', bookName: '유다서', bookCode: 65 },
    { name: '계', bookName: '요한계시록', bookCode: 66 },
  ];
};

// SQLITE 성공/실패 예외처리
let bibleDB = SQLite.openDatabase(
  {
    name: 'BibleDB.db',
    createFromLocation: 1,
  },
  () => {
    console.log('SQLite 조회 성공');
  },
  e => {
    console.log(e);
    console.log('SQLite 연결 실패');
  },
);
export const getSqliteDatabase = () => {
  return bibleDB;
};

export const fetchDataFromSqlite = (query: string) => {
  return new Promise<SQLite.ResultSet>((resolveQuery, rejectQuery) => {
    bibleDB.transaction(tx => {
      tx.executeSql(
        query,
        [],
        (tx, result) => {
          resolveQuery(result);
        },
        err => {
          rejectQuery(err);
        },
      );
    });
  });
};

// sqlite 데이터베이스에서 성경의 정보를 가져와서 verseItems을 만들어서 다음 Promise chain으로 전달하는 메서드
export const getBibleVerseItems = (bookName, bookCode, chapterCode) => {
  return new Promise<VerseItemList>((resolve, reject) => {
    bibleDB.transaction(tx => {
      // 성경의 절과 내용을 모두 가져오는 쿼리를 선언
      // subQuery를 통해 현재 아이템의 최대 chapterCode를 가져온다.
      const query = `SELECT verse, content, (SELECT max(chapter) From bible_korHRV where book = ${bookCode}) as maxChapter FROM bible_korHRV where book = ${bookCode} and chapter = ${chapterCode}`;
      tx.executeSql(query, [], (tx, results) => {
        let verseItemsLength = results.rows.length;
        const verseItems = [];

        for (let i = 0; i < verseItemsLength; i++) {
          const content = results.rows.item(i).content;
          const verseCode = results.rows.item(i).verse;
          const maxChapterCode = results.rows.item(i).maxChapter;
          verseItems.push({
            isButton: false,
            bookName,
            bookCode,
            chapterCode,
            content,
            verseCode,
            maxChapterCode,
          });

          // 마지막 성경 이동 버튼을 위해 현재 verseItems의 마지막행에 하나의 목록을 더 추가한다.
          // if (i === verseItemsLength - 1) {
          //   verseItems.push({
          //     isButton: true,
          //     bookName,
          //     bookCode,
          //     chapterCode,
          //     maxChapterCode,
          //     content,
          //     verseCode: verseCode + 1,
          //   });
          // }
        }
        resolve(verseItems);
      });
    });
  });
};

let tf = function (i: number) {
  // 10보다 작으면 0을 붙여줌
  // ex: 9 => 09
  return (i < 10 ? '0' : '') + i;
};

export const getDateStringByFormat = (date: Date, format: string) => {
  // 정규식을 통해 yyyy, MM, dd 등을 검색하여 해당 날짜로 치환
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
    switch (a) {
      case 'yyyy':
        return tf(date.getFullYear());
      case 'MM':
        return tf(date.getMonth() + 1);
      case 'mm':
        return tf(date.getMinutes());
      case 'dd':
        return tf(date.getDate());
      case 'HH':
        return tf(date.getHours());
      case 'ss':
        return tf(date.getSeconds());
    }
  });
};

/**
 * 60분 내외 : n분전
 * 1시간 ~ 24시간 : n시간전
 * 24시간 이상 : 1일전
 * 30일 이상 1달전
 */
export const getPassTimeText = oldDateString => {
  let nowDate = new Date();
  let oldDate = new Date(oldDateString);

  let now = nowDate.getTime();
  let old = oldDate.getTime();

  let min_gap = Math.floor((now - old) / 1000 / 60);
  let hour_gap = Math.floor((now - old) / 1000 / 60 / 60);
  let day_gap = Math.floor((now - old) / 1000 / 60 / 60 / 24);
  let month_gap = Math.floor((now - old) / 1000 / 60 / 60 / 24 / 30);

  if (min_gap < 1) {
    return '방금전';
  }

  if (min_gap >= 1 && min_gap < 60) {
    return min_gap + '분전';
  }

  if (hour_gap < 24) {
    return hour_gap + '시간전';
  }

  if (day_gap < 31) {
    return day_gap + '일전';
  }

  return month_gap + '달전';
};

// 퀴즈에 공백을 만들고 반환함.
export const makeBlankQuizSentence = (quizSentence: string, quizWord: string) => {
  let dummy = '____________________________________________________';
  // 정답의 크기 X2 로 blank를 만든다. 예를들어 정답이 예수님 이면, ______(6개) 를 만든다.
  // 이유는 UI상 2배가 가장 예쁘게 보인다.
  let blank = dummy.substr(dummy.length - quizWord.length * 2);
  let blankQuizSentence = quizSentence.split(quizWord).join(blank);
  return blankQuizSentence;
};

export const getIsOneDayPassed = (storedDate: Date) => {
  const currentDate = new Date();

  // 날짜 차이 계산 (밀리초 단위)
  const timeDiff = currentDate.getTime() - storedDate.getTime();

  // 24시간(1일)이 지났는지 확인
  const isOneDayPassed = timeDiff > 24 * 60 * 60 * 1000;

  return isOneDayPassed;
};

// 오늘 날짜를 yyyy-MM-dd 형식으로 출력
export const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

export const getTimeAgo = (date: Date) => {
  console.log(date);

  if (!date) {
    return '실패';
  }
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutesAgo = Math.floor(diff / (1000 * 60));
  const hoursAgo = Math.floor(diff / (1000 * 60 * 60));
  const daysAgo = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutesAgo === 0) {
    return `방금전`;
  } else if (minutesAgo < 60) {
    return `${minutesAgo}분전`;
  } else if (hoursAgo < 24) {
    return `${hoursAgo}시간전`;
  } else {
    return `${daysAgo}일전`;
  }
};
