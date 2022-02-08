import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useInView } from 'react-intersection-observer';
import { getUser } from 'store/reducer';
import styled from '@emotion/styled';
import { LinearProgress } from '@mui/material';

import { UserState, ValidRounge } from '@interface/StoreInterface';
import { TopicPost, RoungePost } from '@interface/CardInterface';
import { getHomePostsInfiniteFunction } from '@utils/function';
import Layout from '@layouts/Layout';
import { SearchResult } from '@pages/search';
import { RoungeCard, TopicCard } from '@components/Card';
import NotFoundPage from '@pages/404';

const ListPage = () => {
  const router = useRouter();
  const [results, setResults] = useState<Array<SearchResult>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { ref, inView } = useInView();
  const { user: myInfo }: any = useSelector((state: UserState) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!myInfo) dispatch(getUser());
  }, [myInfo, dispatch]);
  useEffect(() => {
    if (
      myInfo?.validRounges.findIndex(
        (v: ValidRounge) => `/list/${v.url}` === router.asPath,
      ) === -1
    ) {
      return;
      router.push('/404');
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
    return () => {
      setResults([]);
    };
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
      (v: ValidRounge) => `/list/${v.url}` === router.asPath,
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

export default ListPage;

const TimelinePageWrapperDiv = styled.div``;
const TimelineResultsWrapperDiv = styled.div`
  width: 100%;
  padding-bottom: 68px;
`;
