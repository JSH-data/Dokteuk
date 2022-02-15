import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '@firebase/firebase';

interface Post {
  title: string;
  content: string;
}

export default function usePosts(userId: string) {
  const [end, setEnd] = useState<any>(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stopFetch, setStopFetch] = useState<boolean>(false);
  const [firstFetch, setFirstFetch] = useState<boolean>(true);

  const getPosts = async () => {
    let q;

    if (firstFetch) {
      q = query(
        collection(db, 'post'),
        where('userId', '==', `${userId}`),
        orderBy('timestamp', 'asc'),
        limit(10),
      );
    } else {
      q = query(
        collection(db, 'post'),
        where('userId', '==', `${userId}`),
        orderBy('timestamp', 'asc'),
        limit(10),
        startAfter(end),
      );
    }

    const snapshots = await getDocs(q);
    const dataArr: Post[] = [];
    snapshots.forEach((snapshot) => {
      dataArr.push(snapshot.data() as Post);
    });

    if (dataArr.length < 10) setStopFetch(true);
    setPosts([...posts, ...dataArr]);

    setEnd(snapshots.docs[snapshots.docs.length - 1]);
  };

  useEffect(() => {
    setFirstFetch(false);
    getPosts();
  }, []);

  return { end, posts, firstFetch, stopFetch, getPosts };
}
