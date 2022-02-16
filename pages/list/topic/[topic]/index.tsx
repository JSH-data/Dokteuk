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

export default function TopicPage() {
  const router = useRouter();

  const topicType = router.query.topic as string;

  const { ref, inView } = useInView();
  const [test, setTest] = useState(false);

  const [stopFetch, setStopFetch] = useState<boolean>(false); // 파이어베이스 연동시 사용

  const [end, setEnd] = useState<any>(0); // 파이어베이스 연동시 사용

  const dispatch = useDispatch();

  const { data, key } = useSelector(
    (state: RootReducer) => state.tempData.tempData,
  );
  useLayoutEffect(() => {
    if (data.length === 0 || router.asPath.split('/')[3] !== key) {
      console.log('첫 번째 디스패치', '이거 언제 실행됨?');
      dispatch(
        setDataAction({
          data: getTopics(topicType, 'test'),
          key: router.asPath.split('/')[3],
        }),
      );
    }
    setTest(true);
  }, []);

  useEffect(() => {
    if (inView === true && stopFetch === false && data.length >= 10) {
      const newtPosts = getTopics(topicType, 'test');
      dispatch(
        setDataAction({
          data: [...data, ...newtPosts],
          key: router.asPath.split('/')[3],
        }),
      );
    }
  }, [inView]);
  console.log('@@@', data, '@@@@');
  return (
    <Layout>
      {test &&
        data.length !== 0 &&
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

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (ctx) => {
    const type = ctx.query.topic;
    const data = store.getState();
    console.log('@@@@@@@@@@', data.tempData, 'asdasd');

    // if (data.tempData.key !== type) {
    //   store.dispatch(
    //     setDataAction({
    //       data: [],
    //       key: type,
    //     }),
    //   );
    // }

    return {
      props: {},
    };
  });
