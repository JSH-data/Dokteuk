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

export default function useNotification() {
  const router = useRouter();
  const [end, setEnd] = useState<any>(0);
  const [stopFetch, setStopFetch] = useState<boolean>(false);
  const dispatch = useDispatch();

  const { data, key } = useSelector(
    (state: RootReducer) => state.tempData.tempData,
  );

  const { user } = useSelector((state: RootReducer) => state.user);

  const getNotifications = async () => {
    const q = await query(
      collection(db, 'notification'),
      where('userId', '==', `${user.id}`),
      orderBy('createdAt', 'desc'),
      limit(3),
    );
    const snapshots = await getDocs(q);
    const myNotis: any = [];
    snapshots.forEach((snapshot) => {
      const returnData = snapshot.data();
      const myNotiData = {
        alertType: returnData.alertType,
        originContent: returnData.originContent,
        content: returnData.content,
        createdAt: returnData.createdAt,
        postType: returnData.postType,
        postUrl: returnData.postUrl,
      };
      myNotis.push(myNotiData);
    });

    if (myNotis.length < 3) setStopFetch(true);

    setEnd(snapshots.docs[snapshots.docs.length - 1]);

    dispatch(
      setDataAction({
        data: myNotis,
        key: 'notification',
      }),
    );
  };

  const getMoreNotifications = async (lastNum: number) => {
    const notiRef = collection(db, 'notification');
    let lastSnap;
    if (end === 0) {
      const after = query(
        notiRef,
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
      notiRef,
      where('userId', '==', `${user.id}`),
      orderBy('createdAt', 'desc'),
      limit(3),
      startAfter(lastSnap),
    );
    const snapshots = await getDocs(q);
    const myNotis: any = [];
    snapshots.forEach((snapshot) => {
      const returnData = snapshot.data();
      const myNotiData = {
        alertType: returnData.alertType,
        originContent: returnData.originContent,
        content: returnData.content,
        createdAt: returnData.createdAt,
        postType: returnData.postType,
        postUrl: returnData.postUrl,
      };
      myNotis.push(myNotiData);
    });

    if (myNotis.length < 3) {
      setStopFetch(true);
    }
    setEnd(snapshots.docs[snapshots.docs.length - 1]);
    dispatch(
      setDataAction({
        data: [...data, ...myNotis],
        key: `notification`,
      }),
    );
  };

  useEffect(() => {
    if (data.length === 0 || 'notification' !== key) {
      getNotifications();
    }
  }, []);

  useLayoutEffect(() => {
    if (!user.id) router.push('/user/login');
  }, []);

  return { data, key, stopFetch, getMoreNotifications };
}
