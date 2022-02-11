import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useInView } from 'react-intersection-observer';
import { getUser } from 'store/reducer';
import styled from '@emotion/styled';
import { LinearProgress } from '@mui/material';

import { StoreState, UserState, ValidRounge } from '@interface/StoreInterface';
import { TopicPost, RoungePost } from '@interface/CardInterface';
import { getHomePostsInfiniteFunction } from '@utils/function';
import Layout from '@layouts/Layout';
import { SearchResult } from '@pages/search';
import { RoungeCard, TopicCard } from '@components/Card';
import NotFoundPage from '@pages/404';
import { setViewAction } from '@store/reducer';
const RoungePage = () => {
  const router = useRouter();
  const [results, setResults] = useState<Array<SearchResult>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { ref, inView } = useInView();
  const { user: myInfo } = useSelector((state: StoreState) => state.user);
  const dispatch = useDispatch();
  const { view } = useSelector((state: StoreState) => state.view);
  useEffect(() => {
    dispatch(setViewAction([1, 2, 3, 4, 5]));
    console.log(view);
  }, [router]);

  const [asPath, setAsPathname] = useState<string>(router.asPath);

  useEffect(() => {
    setAsPathname(router.asPath);
    if (router.asPath === asPath) {
      console.log('뒤로가기입니다');
    }
  }, [router.asPath]);

  useEffect(() => {
    if (!myInfo) dispatch(getUser());
  }, [myInfo, dispatch]);
  useEffect(() => {
    console.log(myInfo?.validRounges.map((v: any) => `/list/rounge/${v.url}`));
    console.log(router.asPath);
    if (
      myInfo?.validRounges.findIndex(
        (v: ValidRounge) => `/list/rounge/${v.url}` === router.asPath,
      ) === -1
    ) {
      return;
    } else {
      (async () => {
        setIsLoading(true);
        const result = await getHomePostsInfiniteFunction(
          router.asPath.split('/')[2],
          0,
        );
        setIsLoading(false);
        setResults([result]);
      })();
    }
  }, [router, myInfo]);
  useEffect(() => {
    if (inView) {
      (async () => {
        const nextResult = await getHomePostsInfiniteFunction(
          router.asPath.split('/')[2],
          results[results.length - 1].nextPage,
        );
        setResults([...results, nextResult]);
      })();
    }
  }, [inView, results, router.asPath]);
  useEffect(() => {
    console.log('pathname: ', router.asPath);
  }, [router.asPath]);
  const renderData = results.flatMap((value: any) => value.result) ?? [];
  // console.log(renderData[1]?.content);
  // console.log(renderData?.length);
  if (isLoading && results.length === 0) {
    return (
      <Layout>
        <LinearProgress />
      </Layout>
    );
  }
  if (
    myInfo?.validRounges.findIndex(
      (v: ValidRounge) => `/list/rounge/${v.url}` === router.asPath,
    ) === -1
  ) {
    return <NotFoundPage />;
  }
  return (
    <>
      <Layout>
        <TimelinePageWrapperDiv>
          <TimelineResultsWrapperDiv>
            {(renderData as Array<TopicPost | RoungePost>)?.map((post, i) => {
              if (
                i >=
                (renderData as Array<TopicPost | RoungePost>).length - 10
              ) {
                return post.postType === 'topic' ? (
                  <TopicCard topicCardData={post} key={post.postId} ref={ref} />
                ) : (
                  <RoungeCard
                    roungeCardData={post}
                    key={post.postId}
                    ref={ref}
                  />
                );
              }
              return post.postType === 'topic' ? (
                <TopicCard topicCardData={post} key={post.postId} />
              ) : (
                <RoungeCard roungeCardData={post} key={post.postId} />
              );
            })}
          </TimelineResultsWrapperDiv>
        </TimelinePageWrapperDiv>
      </Layout>
    </>
  );
};

export default RoungePage;

const TimelinePageWrapperDiv = styled.div``;
const TimelineResultsWrapperDiv = styled.div`
  width: 100%;
  padding-bottom: 68px;
`;

// export default function () {
//   const router = useRouter();
//   const [asPath, setAsPath] = useState('');
//   useEffect(() => {
//     setAsPath(router.asPath);
//   }, [router]);
//   return (
//     <div>
//       <div>asPath:{asPath}</div>
//       <br />
//       <div>rounge의 indexPage</div>
//     </div>
//   );
// }
