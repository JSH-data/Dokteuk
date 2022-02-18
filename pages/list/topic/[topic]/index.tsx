import { useRouter } from 'next/router';
import { useEffect, useLayoutEffect, useState } from 'react';
import Layout from '@layouts/Layout';
import { TopicPageCard } from '@components/Card';
import { TopicPost } from '@interface/CardInterface';
import { useInView } from 'react-intersection-observer';
import { useSelector, useDispatch } from 'react-redux';
import { setDataAction } from '@store/reducer';
import { RootReducer } from '@store/reducer';
import styled from '@emotion/styled';

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

  // const topicType = router.query.topic as string;

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
      limit(20),
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
    if (topics.length < 20) {
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
      limit(20),
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

    if (topics.length < 20) {
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
    console.log(inView);
    if (
      inView === true &&
      stopFetch === false &&
      data.length >= 20 &&
      key == router.asPath.split('/')[3]
    ) {
      getMoreNotification(data.length);
    }
  }, [inView]);

  if (!data[0]?.topic?.url) {
    return (
      <Layout>
        <LoadingDiv />
      </Layout>
    );
  }

  return (
    <Layout>
      {data.length !== 0 &&
        data.map((post: TopicPost, idx: number) => (
          <TopicPageCard topicCardData={post} key={idx} />
        ))}
      <div ref={ref} style={{ height: '100px', paddingBottom: '50px' }}></div>
    </Layout>
  );
}

const LoadingDiv = styled.div`
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  backgroundcolor: black;
  opacity: 0.3;
`;
