import type {
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next';
import wrapper from '@store/configureStore';
import { useEffect, useState, useLayoutEffect } from 'react';
import Layout from '@layouts/Layout';
import { Container } from '@mui/material';
import Head from 'next/head';
import NotificationCard from '@components/notification/NotificationCard';
import { notificationCheck } from '@utils/notificationUpdate';
import { useSelector, useDispatch } from 'react-redux';
import { RootReducer } from '@store/reducer';
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
import { getDateTime } from '@utils/function';
import { useInView } from 'react-intersection-observer';
import { setTempDataInitializing } from '@store/reducer';

const Notification: NextPage = () => {
  // const userInfo = useSelector((state: RootReducer) => state.user.user);
  const { data, key } = useSelector(
    (state: RootReducer) => state.tempData.tempData,
  );

  const [stopFetch, setStopFetch] = useState<boolean>(false); // 파이어베이스 연동시 사용
  const [end, setEnd] = useState<any>(0);
  const [test, setTest] = useState(false);

  const { ref, inView } = useInView();

  const dispatch = useDispatch();

  const getNotification = async () => {
    const q = await query(
      collection(db, 'notification'),
      where('userId', '==', `${'hPJXTVu1T3dMsXObcQPhsei7r7y1'}`),
      orderBy('createdAt', 'desc'),
      limit(10),
    );
    const snapshots = await getDocs(q);
    const dataArr: any = [];
    snapshots.forEach((snapshot) => {
      dataArr.push(snapshot.data());
    });
    if (dataArr.length < 10) setStopFetch(true);

    setEnd(snapshots.docs[snapshots.docs.length - 1]);
    dispatch(
      setDataAction({
        data: dataArr,
        key: 'notification',
      }),
    );
  };

  useEffect(() => {
    if (data[0]?.postUrl) {
      setTest(true);
    }
  }, [data]);

  const getMoreNotification = async () => {
    const q = query(
      collection(db, 'notification'),
      where('userId', '==', `${'hPJXTVu1T3dMsXObcQPhsei7r7y1'}`),
      orderBy('createdAt', 'desc'),
      limit(10),
      startAfter(end),
    );
    const snapshots = await getDocs(q);
    const dataArr: any = [];
    snapshots.forEach((snapshot) => {
      dataArr.push(snapshot.data());
    });
    console.log('버튼클릭 클라이언트');
    if (dataArr.length < 10) setStopFetch(true);

    dispatch(
      setDataAction({
        data: [...data, ...dataArr],
        key: 'notification',
      }),
    );
  };

  useEffect(() => {
    if (data.length === 0 || 'notification' !== key) {
      console.log('ssss');
      getNotification();
    }
    // setTest(true);
  }, []);

  useEffect(() => {
    notificationCheck('hPJXTVu1T3dMsXObcQPhsei7r7y1');
  }, []);

  useEffect(() => {
    if (
      inView === true &&
      stopFetch === false &&
      data.length >= 10 &&
      key == 'notification'
    ) {
      console.log(inView, stopFetch, data.length);
      getMoreNotification();
    }
  }, [inView]);

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
            {test &&
              data.length != 0 &&
              data.map((v: any, i: number) => (
                <NotificationCard
                  key={i}
                  type={v.alertType}
                  time={getDateTime(v.createdAt)}
                  originContent={v.orginContent}
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

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (ctx) => {
    console.log('버튼클릭 서버');

    const data = store.getState();
    console.log('@@@@@@@@@@', data.tempData, 'asdasd');
    if (data.tempData.key !== 'notification') {
      console.log('sss');
      await store.dispatch(
        setTempDataInitializing({
          data: [],
          key: 'notification',
        }),
      );
    }

    if (data.user.user.nickname == '') {
      return {
        redirect: {
          destination: '/user/login',
          permanent: false,
        },
      };
    }

    return {
      props: { userId: data.user.user.id },
    };
  });
