import type { NextPage } from 'next';
import { useEffect } from 'react';
import Layout from '@layouts/Layout';
import { Container } from '@mui/material';
import Head from 'next/head';
import NotificationCard from '@components/notification/NotificationCard';
import { NotificationData } from '@interface/notification';
import { LoadingDiv } from '@components/items/LoadingDiv';
import { getDateTime } from '@utils/function';
import { useInView } from 'react-intersection-observer';
import useNotification from '@hooks/useNotification';
import Empty from '@components/Empty';

const Notification: NextPage = () => {
  const { ref, inView } = useInView();
  const { data, key, stopFetch, getMoreNotifications } = useNotification();

  useEffect(() => {
    if (
      inView === true &&
      stopFetch === false &&
      data.length >= 2 &&
      key == 'notification'
    ) {
      getMoreNotifications(data.length);
    }
  }, [inView]);

  if (!data[0]?.postUrl) {
    return (
      <Layout>
        <LoadingDiv />
        <Empty ment="아직 새로운 알림이 없습니다." />
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
        <Container style={{ maxWidth: '680px' }}>
          <div style={{ marginTop: '30px' }}>
            {data.length != 0 &&
              data.map((v: NotificationData, i: number) => (
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
          <div
            ref={ref}
            style={{ height: '100px', paddingBottom: '50px' }}
          ></div>
        </Container>
      </Layout>
    </>
  );
};
export default Notification;
