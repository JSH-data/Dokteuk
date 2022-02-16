import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState, useLayoutEffect } from 'react';
import Layout from '@layouts/Layout';
import { Container } from '@mui/material';
import Head from 'next/head';
import NotificationCard from '@components/notification/NotificationCard';
import { notificationCheck } from '@utils/notificationUpdate';
import { useSelector, useDispatch } from 'react-redux';
import { RootReducer } from '@store/reducer';
import { setDataAction } from '@store/reducer';
import LoadingDiv from '@components/items/LoadingDiv';
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  orderBy,
  startAfter,
} from 'firebase/firestore';
import { db } from '@firebase/firebase';
import { getDateTime } from '@utils/function';
import { useInView } from 'react-intersection-observer';

const Notification: NextPage = () => {
  const { data, key } = useSelector(
    (state: RootReducer) => state.tempData.tempData,
  );

  const { user } = useSelector((state: RootReducer) => state.user);

  const [stopFetch, setStopFetch] = useState<boolean>(false); // 파이어베이스 연동시 사용
  const [end, setEnd] = useState<any>(0);
  const router = useRouter();

  const { ref, inView } = useInView();

  const dispatch = useDispatch();

  const getNotification = async () => {
    const q = await query(
      collection(db, 'notification'),
      where('userId', '==', `${user.id}`),
      orderBy('createdAt', 'desc'),
      limit(2),
    );
    const snapshots = await getDocs(q);
    const dataArr: any = [];
    snapshots.forEach((snapshot) => {
      dataArr.push(snapshot.data());
    });
    if (dataArr.length < 2) setStopFetch(true);

    setEnd(snapshots.docs[snapshots.docs.length - 1]);

    dispatch(
      setDataAction({
        data: dataArr,
        key: 'notification',
      }),
    );
  };

  const getMoreNotification = async (lastNum: number) => {
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
      limit(2),
      startAfter(lastSnap),
    );
    const snapshots = await getDocs(q);
    const dataArr: any = [];
    snapshots.forEach((snapshot) => {
      dataArr.push(snapshot.data());
    });
    setEnd(snapshots.docs[snapshots.docs.length - 1]);
    if (dataArr.length < 2) setStopFetch(true);

    dispatch(
      setDataAction({
        data: [...data, ...dataArr],
        key: 'notification',
      }),
    );
  };

  useEffect(() => {
    if (data.length === 0 || 'notification' !== key) {
      getNotification();
    }
  }, []);

  useLayoutEffect(() => {
    if (!user.id) {
      router.push('/user/login');
    } else {
      notificationCheck(user.id);
    }
  }, []);

  useEffect(() => {
    if (
      inView === true &&
      stopFetch === false &&
      data.length >= 2 &&
      key == 'notification'
    ) {
      getMoreNotification(data.length);
    }
  }, [inView]);

  if (!data[0]?.postUrl) {
    return (
      <Layout>
        <LoadingDiv />
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>알림페이지</title>
        <meta name="description" content="Generate by elice Team 5" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Container>
          <div style={{ marginTop: '30px' }}>
            {data.length != 0 &&
              data.map((v: any, i: number) => (
                <NotificationCard
                  key={i}
                  type={v.alertType}
                  time={getDateTime(v.createdAt)}
                  originContent={v.originContent}
                  content={v.content}
                  postType={v.postType}
                  postUrl={v.postUrl}
                />
              ))}
          </div>
          <div ref={ref} style={{ height: '50px' }}></div>
        </Container>
      </Layout>
    </>
  );
};
export default Notification;
