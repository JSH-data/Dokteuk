import { useRouter } from 'next/router';
import { useEffect, useLayoutEffect, useState } from 'react';
import wrapper from '@store/configureStore';
import Layout from '@layouts/Layout';
import { getTopics } from '@utils/function';
import { TestTopicCard } from '@components/Card';
import { TopicPost } from '@interface/CardInterface';
import { useInView } from 'react-intersection-observer';
import { useSelector, useDispatch } from 'react-redux';
import { setDataAction } from '@store/reducer';
import { RootReducer } from '@store/reducer';
import type {
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next';

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

export default function TopicPage() {
  const router = useRouter();

  const topicType = router.query.topic as string;

  const { ref, inView } = useInView();

  const [stopFetch, setStopFetch] = useState<boolean>(false); // 파이어베이스 연동시 사용

  const [end, setEnd] = useState<any>(0); // 파이어베이스 연동시 사용

  const dispatch = useDispatch();

  const { data, key } = useSelector(
    (state: RootReducer) => state.tempData.tempData,
  );

  const getTopicPost = async () => {
    const q = query(
      collection(db, 'post'),
      where('topic.url', '==', `${router.asPath.split('/')[3]}`),
      orderBy('createdAt', 'desc'),
      limit(2),
    );
    const snapshots = await getDocs(q);
    const topics: Array<TopicPost> = [];
    snapshots.forEach((doc) => {
      const topicData = doc.data();
      const returnData: TopicPost = {
        author: { nickname: topicData.nickname, jobSector: topicData.job },
        content: topicData.content,
        commentsCount: topicData.commentsCount || 0,
        createdAt: topicData.createdAt.seconds
          .toString()
          .padEnd(13, 0)
          .toString(),
        images: topicData.images,
        likeCount: topicData.pressPerson.length,
        postId: topicData.postId,
        postType: topicData.postType,
        title: topicData.title,
        topic: topicData.topic,
        pressPerson: topicData.pressPerson,
      };
      topics.push(returnData);
    });
    setEnd(snapshots.docs[snapshots.docs.length - 1]);
    dispatch(
      setDataAction({
        data: topics,
        key: router.asPath.split('/')[3],
      }),
    );
    if (topics.length < 2) {
      setStopFetch(true);
    }
  };

  const getMoreNotification = async (lastNum: number) => {
    const postRef = collection(db, 'post');
    let lastSnap;
    if (end === 0) {
      const after = query(
        postRef,
        where('topic.url', '==', `${router.asPath.split('/')[3]}`),
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
      where('topic.url', '==', `${router.asPath.split('/')[3]}`),
      orderBy('createdAt', 'desc'),
      limit(2),
      startAfter(lastSnap),
    );
    const snapshots = await getDocs(q);
    const topics: Array<TopicPost> = [];
    snapshots.forEach((doc) => {
      const topicData = doc.data();
      const returnData: TopicPost = {
        author: { nickname: topicData.nickname, jobSector: topicData.job },
        content: topicData.content,
        commentsCount: topicData.commentsCount || 0,
        createdAt: topicData.createdAt.seconds
          .toString()
          .padEnd(13, 0)
          .toString(),
        images: topicData.images,
        likeCount: topicData.pressPerson.length,
        postId: topicData.postId,
        postType: topicData.postType,
        title: topicData.title,
        topic: topicData.topic,
        pressPerson: topicData.pressPerson,
      };
      topics.push(returnData);
    });

    if (topics.length < 2) {
      setStopFetch(true);
    }
    setEnd(snapshots.docs[snapshots.docs.length - 1]);
    dispatch(
      setDataAction({
        data: [...data, ...topics],
        key: `${router.asPath.split('/')[3]}`,
      }),
    );
  };
  useEffect(() => {
    if (data.length === 0 || router.asPath.split('/')[3] !== key) {
      getTopicPost();
    }
  }, []);

  useEffect(() => {
    console.log(inView, stopFetch, data.length, key);
    if (
      inView === true &&
      stopFetch === false &&
      data.length >= 2 &&
      key == router.asPath.split('/')[3]
    ) {
      getMoreNotification(data.length);
    }
  }, [inView]);

  if (!data[0]?.title) {
    return <Layout>로딩 중...</Layout>;
  }

  return (
    <Layout>
      {data.length !== 0 &&
        data.map((post: any, idx: number) => {
          return idx == data.length - 2 ? (
            <TestTopicCard topicCardData={post} key={idx} />
          ) : (
            <TestTopicCard topicCardData={post} key={idx} />
          );
        })}
      <div ref={ref} style={{ height: '50px' }}></div>
    </Layout>
  );
}
