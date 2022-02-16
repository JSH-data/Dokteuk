import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useInView } from 'react-intersection-observer';
import styled from '@emotion/styled';
import { LinearProgress } from '@mui/material';

import {
  SearchResult,
  StoreState,
  UserState,
  ValidRounge,
} from '@interface/StoreInterface';
import { TopicPost, RoungePost } from '@interface/CardInterface';
import { getHomePostsInfiniteFunction } from '@utils/function';
import Layout from '@layouts/Layout';
import { RoungeCard, TopicCard } from '@components/Card';
import NotFoundPage from '@pages/404';
import {
  getUser,
  setViewAction,
  resetViewAction,
  setScrollAction,
  initialViewAction,
  setSearchValueAction,
} from '@store/reducer';
import wrapper from '@store/configureStore';

import useDebounce from '@hooks/useDebounce';
import {
  DefaultListsAndTopics,
  HomeListUrlString,
} from '@interface/GetPostsInterface';

const ListPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { ref, inView } = useInView();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [asPath, setAsPath] = useState<string>(router.asPath);
  const { user: myInfo }: UserState = useSelector(
    (state: StoreState) => state.user,
  );
  const { view }: { view: Array<SearchResult> } = useSelector(
    (state: StoreState) => state.view,
  );
  const { scrollY }: { scrollY: number } = useSelector(
    (state: StoreState) => state.scroll,
  );
  const paddingFunction = useDebounce({
    cb: () => window.scrollY !== 0 && dispatch(setScrollAction(window.scrollY)),
    ms: 100,
  });
  useEffect(() => {
    window.addEventListener('scroll', paddingFunction);
    return () => {
      window.removeEventListener('scroll', paddingFunction);
      // dispatch(resetViewAction());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // useEffect(() => {
  //   if (!myInfo) dispatch(getUser());
  // }, [myInfo, dispatch]);

  useEffect(() => {
    if (router.asPath !== asPath) {
      dispatch(resetViewAction()); // 뒤로가기로 온 게 아닐때 View를 Reset한다.
      dispatch(setScrollAction(0));
      router.events.on(
        'routeChangeComplete',
        () => {
          window.scrollTo({ top: 0 });
        },
        // setTimeout(() => window.scrollTo({ top: 0 }), 0),
      );
    } else
      router.events.on(
        'routeChangeComplete',
        () => {
          window.scrollTo({ top: scrollY });
        },
        // setTimeout(() => window.scrollTo({ top: scrollY }), 0),
      );

    setAsPath(router.asPath);
  }, [router.asPath]);

  useEffect(() => {
    if (view.length === 0)
      (async () => {
        dispatch(
          setViewAction(
            await getHomePostsInfiniteFunction(
              router.asPath.split('/')[2] as HomeListUrlString,
              0,
              myInfo.validRounges.map((v) => v.url),
            ),
          ),
        );
      })();
  }, [view]);
  useEffect(() => {
    if (inView && view[view.length - 1].nextPage !== -1) {
      // if (inView) {
      (async () => {
        console.log('inView');
        setIsLoading(true);
        const nextResults = await getHomePostsInfiniteFunction(
          router.asPath.split('/')[2] as HomeListUrlString,
          view[view.length - 1].nextPage,
          myInfo.validRounges.map((v) => v.url),
        );
        dispatch(setViewAction(nextResults));
        setIsLoading(false);
      })();
    }
  }, [inView]);

  const renderData = view.flatMap((value: any) => value.result) ?? [];
  if (
    myInfo?.validRounges.findIndex(
      (v: ValidRounge) => `/list/${v.url}` === router.asPath,
    ) === -1
  ) {
    return <NotFoundPage />;
  }

  if (isLoading && view.length === 0) {
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
              let isLiked = false;
              if (myInfo?.id) {
                // @ts-ignore
                if (post.pressPerson.indexOf(myInfo.id) !== -1) isLiked = true;
              }
              if (
                i ===
                (renderData as Array<TopicPost | RoungePost>).length - 20
              ) {
                return post.postType === 'topic' ? (
                  <TopicCard
                    topicCardData={post}
                    key={post.postId}
                    ref={ref}
                    isLiked={isLiked}
                  />
                ) : (
                  <RoungeCard
                    roungeCardData={post}
                    key={post.postId}
                    ref={ref}
                    isLiked={isLiked}
                  />
                );
              }
              return post.postType === 'topic' ? (
                <TopicCard
                  topicCardData={post}
                  key={post.postId}
                  isLiked={isLiked}
                />
              ) : (
                <RoungeCard
                  roungeCardData={post}
                  key={post.postId}
                  isLiked={isLiked}
                />
              );
            })}
          </TimelineResultsWrapperDiv>
        </TimelinePageWrapperDiv>
      </Layout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async (props): Promise<any> => {
      store.dispatch(setSearchValueAction(''));
    },
);

export default ListPage;

const TimelinePageWrapperDiv = styled.div``;
const TimelineResultsWrapperDiv = styled.div`
  width: 100%;
  padding-bottom: 68px;
`;
