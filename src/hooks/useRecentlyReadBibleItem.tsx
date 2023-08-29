import { getItemFromAsyncStorage } from '../utils';
import { RecentlyReadBibleItem, RecentlyReadBibleList } from '../screen/bible/RecentlyReadBibleListScreen';
import { RECENTLY_READ_BIBLE_LIST } from '../constraints';
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

const useRecentlyReadBibleItem = () => {
  const [recentlyReadBibleItem, setRecentlyReadBibleItem] = useState<RecentlyReadBibleItem>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    // 다른 화면을 갔다왔을때 확인후 최근읽은 성경 갱신,
    initRecentlyReadBibleListFromStorage();
  }, [isFocused]);

  const initRecentlyReadBibleListFromStorage = () => {
    getItemFromAsyncStorage<RecentlyReadBibleList | null>(RECENTLY_READ_BIBLE_LIST).then(recentlyReadBibleList => {
      setRecentlyReadBibleItem({ ...recentlyReadBibleList[0] });
    });
  };

  useEffect(() => {
    // initRecentlyReadBibleListFromStorage();
  }, []);

  // 최근 읽은 성경구절 정보를 LocalDB에서 가져옴
  return { recentlyReadBibleItem, initRecentlyReadBibleListFromStorage };
};

export default useRecentlyReadBibleItem;
