import { useSelector, useDispatch } from 'react-redux';
import { RootReducer } from '@store/reducer';
import { useRouter } from 'next/router';
import { useState, useEffect, useLayoutEffect } from 'react';
import { setDataAction } from '@store/reducer';
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

export default function useGetMyPost() {
  const router = useRouter();
  const [end, setEnd] = useState<any>(0);
  const [stopFetch, setStopFetch] = useState<boolean>(false);
  const dispatch = useDispatch();

  const { data, key } = useSelector(
    (state: RootReducer) => state.tempData.tempData,
  );

  const { user } = useSelector((state: RootReducer) => state.user);

  const getPosts = async () => {
    const q = await query(
      collection(db, 'post'),
      where('userId', '==', `${user.id}`),
      orderBy('createdAt', 'desc'),
      limit(3),
    );
    const snapshots = await getDocs(q);
    const myPosts: any = [];
    snapshots.forEach((snapshot) => {
      const returnData = snapshot.data();
      const myPostData = {
        title: returnData.title,
        postId: returnData.postId,
        content: returnData.content,
        postType: returnData.postType,
        url:
          returnData.postType == 'topic' ? returnData.topic : returnData.rounge,
      };
      myPosts.push(myPostData);
    });

    if (myPosts.length < 3) setStopFetch(true);

    setEnd(snapshots.docs[snapshots.docs.length - 1]);

    dispatch(
      setDataAction({
        data: myPosts,
        key: 'mypost',
      }),
    );
  };

  const getMorePosts = async (lastNum: number) => {
    const postRef = collection(db, 'post');
    let lastSnap;
    if (end === 0) {
      const after = query(
        postRef,
        where('userId', '==', `${user.id}`),
        orderBy('createdAt', 'desc'),
        limit(lastNum),
      );
      const current = await getDocs(after);
      lastSnap = current.docs[current.docs.length - 1];
    } else {
      lastSnap = end;
    }
    const q = query(
      postRef,
      where('userId', '==', `${user.id}`),
      orderBy('createdAt', 'desc'),
      limit(3),
      startAfter(lastSnap),
    );
    const snapshots = await getDocs(q);
    const myPosts: any = [];
    snapshots.forEach((snapshot) => {
      const returnData = snapshot.data();
      const myPostData = {
        title: returnData.title,
        postId: returnData.postId,
        content: returnData.content,
        postType: returnData.postType,
        url:
          returnData.postType == 'topic' ? returnData.topic : returnData.rounge,
      };
      myPosts.push(myPostData);
    });

    if (myPosts.length < 3) {
      setStopFetch(true);
    }
    setEnd(snapshots.docs[snapshots.docs.length - 1]);
    dispatch(
      setDataAction({
        data: [...data, ...myPosts],
        key: `mypost`,
      }),
    );
  };

  useEffect(() => {
    if (data.length === 0 || 'mypost' !== key) {
      getPosts();
    }
  }, []);

  useLayoutEffect(() => {
    if (!user.id) router.push('/user/login');
  }, []);

  return { data, key, stopFetch, getMorePosts };
}
