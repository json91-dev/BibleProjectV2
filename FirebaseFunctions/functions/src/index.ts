const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

// 성경 장 랜덤
const getRandomBook = () => {
  return Math.floor(Math.random() * 66) + 1;
};

// 성경 절 랜덤
const getRandomChapter = book => {
  const chapterCount = [
    50, 40, 27, 36, 34, 24, 21, 4, 31, 24, 22, 25, 29, 36, 10, 13, 10, 42, 150,
    31, 12, 8, 66, 52, 5, 48, 12, 14, 3, 9, 1, 4, 7, 3, 3, 3, 2, 14, 4, 28, 16,
    24, 21, 28, 16, 16, 13, 6, 6, 4, 4, 5, 3, 6, 4, 3, 1, 13, 5, 5, 3, 5, 1, 1,
    1, 22,
  ];
  return Math.floor(Math.random() * chapterCount[book - 1]) + 1;
};

// 요청할때마다 오늘의 성경을 가져오는 API
// exports.getTodayVerseTest = functions.https.onRequest((request, response) => {
//   const book = getRandomBook();
//   const chapter = getRandomChapter(book);
//   console.log(book, chapter);
//   db.collection('bibleVerse')
//     .where('book', '==', book)
//     .where('chapter', '==', chapter)
//     .get()
//     .then(querySnapshot => {
//       const randomVerse =
//         Math.floor(Math.random() * querySnapshot.size - 1) + 1;
//       querySnapshot.forEach(doc => {
//         if (randomVerse === doc.data().verse) {
//           response.send(doc.data());
//         }
//       });
//     });
// });

exports.setRandomVerseByEveryday = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('Asia/Seoul')
  .onRun(async () => {
    const book = getRandomBook();
    const chapter = getRandomChapter(book);

    const querySnapshot = await db
      .collection('bibleVerse')
      .where('book', '==', book)
      .where('chapter', '==', chapter)
      .get();

    const randomVerse = Math.floor(Math.random() * querySnapshot.size - 1) + 1;
    querySnapshot.forEach(doc => {
      if (randomVerse === doc.data().verse) {
        const versePath = doc.id.replaceAll('_', ' ');
        const content = doc.data().content;

        db.collection('todayVerse')
          .doc('data')
          .set({
            versePath,
            content,
          })
          .then(() => {
            console.log('오늘의 성경 입력 성공');
          });
      }
    });
  });
