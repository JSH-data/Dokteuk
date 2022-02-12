import { FormEvent, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUser,
  initialViewAction,
  resetViewAction,
  setScrollAction,
  setSearchValueAction,
  setViewAction,
} from 'store/reducer';
import { useInView } from 'react-intersection-observer';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

import { TopicPost, RoungePost } from '@interface/CardInterface';
import { StoreState, UserState, ViewPosts } from '@interface/StoreInterface';
import { RoungeCard, TopicCard } from '@components/Card';
import { ChildrenWrapperDivStyled } from '@layouts/Layout';
import Footer from '@layouts/Footer';
import { HeaderWrapperDivStyled } from '@layouts/Header';
import { searchInfiniteFunction } from '@utils/function';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import useDebounce from '@hooks/useDebounce';
import wrapper from '@store/configureStore';

const Search = () => {
  const dispatch = useDispatch();
  const { view, searchValue }: ViewPosts = useSelector(
    (state: StoreState) => state.view,
  );
  const { ref, inView } = useInView();
  useEffect(() => {
    if (view.length === 0 && searchValue) {
      (async () => {
        dispatch(
          initialViewAction(await searchInfiniteFunction(searchValue, 0)),
        );
      })();
    }
  }, [searchValue, view]);
  useEffect(() => {
    if (inView) {
      (async () => {
        console.log(searchValue);
        console.log(view);
        dispatch(
          setViewAction(
            await searchInfiniteFunction(
              searchValue,
              view[view.length - 1].nextPage,
            ),
          ),
        );
      })();
    }
  }, [inView]);
  const renderData = view.flatMap((value: any) => value.result) ?? [];
  if (renderData.length > 0) {
    return (
      <SearchResultsWrapperDiv>
        {(renderData as Array<TopicPost | RoungePost>)?.map((post, i) => {
          if (i >= (renderData as Array<TopicPost | RoungePost>).length - 10) {
            return post.postType === 'topic' ? (
              <TopicCard topicCardData={post} key={post.postId} ref={ref} />
            ) : (
              <RoungeCard roungeCardData={post} key={post.postId} ref={ref} />
            );
          }
          return post.postType === 'topic' ? (
            <TopicCard topicCardData={post} key={post.postId} />
          ) : (
            <RoungeCard roungeCardData={post} key={post.postId} />
          );
        })}
      </SearchResultsWrapperDiv>
    );
  }
  return (
    <SearchPageWrapperDiv>최근에 검색한 내용이 없습니다.</SearchPageWrapperDiv>
  );
};
const WrappedSearch = ({ referer }: { referer: -1 | 1 }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  // useEffect(() => {
  //   if (!myInfo) dispatch(getUser());
  // }, [myInfo, dispatch]);
  const { user: myInfo } = useSelector((state: StoreState) => state.user);
  const { scrollY } = useSelector((state: StoreState) => state.scroll);
  const [searchValue, setSearchValue] = useState('');
  const paddingFunction = useDebounce({
    cb: () => window.scrollY !== 0 && dispatch(setScrollAction(window.scrollY)),
    ms: 100,
  });
  useEffect(() => {
    if (referer === -1) {
      dispatch(setSearchValueAction(''));
      dispatch(resetViewAction());
    }
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
    if (referer === -1) {
      dispatch(resetViewAction());
      dispatch(setScrollAction(0));
    } else {
      window.scrollTo({ top: scrollY });
    }
  }, [router.asPath]);

  const onSubmitSearchForm = async (e: FormEvent) => {
    e.preventDefault(); // form 액션으로 인한 refresh 방지
    const value = (
      e.currentTarget.querySelector(
        'input[name="search-value"]',
      ) as HTMLInputElement
    ).value; // form 내 input value
    if (!value) return; // value가 없을 시 return
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 새로 검색 시 상단스크롤
    setSearchValue(value); // value값 변경
    dispatch(setSearchValueAction(value));
    dispatch(resetViewAction());
  };

  return (
    <>
      <HeaderWrapperDivStyled>
        <SearchWrapperStyled>
          <SearchFormStyled onSubmit={onSubmitSearchForm}>
            <SearchOutlinedIconStyled fontSize="medium" />
            <InputStyled
              name="search-value"
              type="text"
              placeholder="검색어, #태그로 검색"
            />
          </SearchFormStyled>
        </SearchWrapperStyled>
      </HeaderWrapperDivStyled>
      <ChildrenWrapperDivStyled>
        <Search />
      </ChildrenWrapperDivStyled>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const returnProps: { referer: 1 | -1 } = { referer: -1 };
  // referer prop은 URL직접접근 시 undefined 이기 때문에 ''
  // search결과에서의 뒤로가기가 아니면 -1
  if (
    context.req.headers.referer &&
    context.req.headers.referer?.split('/').indexOf('search') !== -1
  )
    returnProps.referer = 1;
  // 값이 존재 하면서 search가 존재한다면 결과에서 뒤로가기로 접근한 것
  return { props: returnProps };
};
export default WrappedSearch;

const SearchPageWrapperDiv = styled.div`
  background-color: ${({ theme }: any) =>
    theme.customTheme.defaultMode.searchPageWrapperBackgroundColor};
  color: rgb(81, 81, 83);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: left;
  height: 20vh;
  border-top: solid 1px white;
  border-bottom: solid 1px white;
  // border-top: solid 1px rgb(59, 59, 61);
  // border-bottom: solid 1px rgb(59, 59, 61);
  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }: any) =>
      theme.customTheme.darkMode.searchPageWrapperBackgroundColor};
  }
`;
const SearchResultsWrapperDiv = styled.div`
  width: 100%;
  padding-bottom: 68px;
`;

const SearchWrapperStyled = styled.div`
  background-color: ${({ theme }: any) =>
    theme.customTheme.defaultMode.headerMenuBackgroundColor};
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  ${({ theme }: any) =>
    `border-bottom: 2px solid ${theme.customTheme.defaultMode.searchWrapperBorderBottomColor}`};
  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }: any) =>
      theme.customTheme.darkMode.headerMenuBackgroundColor};
    ${({ theme }: any) =>
      `border-bottom: 2px solid ${theme.customTheme.darkMode.searchWrapperBorderBottomColor}`};
  }
`;
const InputStyled = styled.input`
  background-color: ${({ theme }: any) =>
    theme.customTheme.defaultMode.searchInputBackgroundColor};
  color: ${({ theme }: any) =>
    theme.customTheme.defaultMode.searchInputTextColor};
  border: 0;
  border-radius: 10px;
  height: 30px;
  padding: 1rem 0.8rem 1rem 0.8rem;
  width: 90vw;
  max-width: 600px;
  padding-left: 36px;
  transition: 0.3s;
  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }: any) =>
      theme.customTheme.darkMode.searchInputBackgroundColor};
    color: ${({ theme }: any) =>
      theme.customTheme.darkMode.searchInputTextColor};
  }
`;

const SearchFormStyled = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
const SearchOutlinedIconStyled = styled(SearchOutlinedIcon)`
  color: rgb(145, 145, 146);
  margin-right: -32px;
  z-index: 1;
`;
