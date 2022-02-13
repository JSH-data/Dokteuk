import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@layouts/Layout';
import { getTopics } from '@utils/function';
import { TestTopicCard } from '@components/Card';
import { TopicPost } from '@interface/CardInterface';
import { useInView } from 'react-intersection-observer';
import { useSelector, useDispatch } from 'react-redux';
import { setDataAction } from '@store/reducer';
import { RootReducer } from '@store/reducer';

export default function TopicPage() {
  const router = useRouter();

  const topicType = router.query.topic as string;

  const { ref, inView } = useInView();
  const [firstFetch, setFirstFetch] = useState<boolean>(true);

  const [stopFetch, setStopFetch] = useState<boolean>(false); // 파이어베이스 연동시 사용

  const [end, setEnd] = useState<any>(0); // 파이어베이스 연동시 사용

  const dispatch = useDispatch();

  const { posts } = useSelector((state: RootReducer) => state.posts);

  useEffect(() => {
    if (posts.length === 0 && firstFetch) {
      console.log('첫 번째 디스패치');
      dispatch(setDataAction(getTopics(topicType, 'test')));
      setFirstFetch(false);
    }
  }, []);

  useEffect(() => {
    if (inView === true && firstFetch === false && stopFetch === false) {
      const newtPosts = getTopics(topicType, 'test');
      dispatch(setDataAction([...posts, ...newtPosts]));
    }
  }, [inView]);

  return (
    <Layout>
      {posts.length &&
        posts.map((post: any, idx: any) => (
          <>
            {idx == posts.length - 2 ? (
              <TestTopicCard topicCardData={post} key={post.postId} ref={ref} />
            ) : (
              <TestTopicCard topicCardData={post} key={post.postId} />
            )}
          </>
        ))}
    </Layout>
  );
}
