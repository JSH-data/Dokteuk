import { FormEvent, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from 'store/reducer';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useInView } from 'react-intersection-observer';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

import { TopicPost, RoungePost } from '@interface/CardInterface';
import { UserState } from '@interface/StoreInterface';
import { RoungeCard, TopicCard } from '@components/Card';
import { ChildrenWrapperDivStyled } from '@layouts/Layout';
import Footer from '@layouts/Footer';
import { HeaderWrapperDivStyled } from '@layouts/Header';
import { getMyInfo, searchInfiniteFunction } from '@utils/function';

export interface SearchResult {
  result: Array<TopicPost | RoungePost>;
  nextPage: number;
}
const Search = ({ searchValue = '' }: { searchValue: string }) => {
  const [searchResults, setSearchResults] = useState<Array<SearchResult>>([]);
  useEffect(() => {
    (async () => {
      const results = await searchInfiniteFunction(searchValue, 0);
      setSearchResults([results]);
    })();
  }, [searchValue]);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      (async () => {
        const nextResult = await searchInfiniteFunction(
          searchValue,
          searchResults[searchResults.length - 1].nextPage,
        );
        setSearchResults([...searchResults, nextResult]);
      })();
    }
  }, [inView, searchResults, searchValue]);
  const renderData = searchResults.flatMap((value: any) => value.result) ?? [];
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
const WrappedSearch = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const { user: myInfo }: any = useSelector((state: UserState) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!myInfo) dispatch(getUser());
  }, [myInfo, dispatch]);
  const onSubmitSearchForm = async (e: FormEvent) => {
    e.preventDefault(); // form 액션으로 인한 refresh 방지
    const value = (
      e.currentTarget.querySelector(
        'input[name="search-value"]',
      ) as HTMLInputElement
    ).value; // form 내 input value
    if (!value) return; // value가 없을 시 return
    document
      .querySelector('#main-content')
      ?.scrollTo({ top: 0, behavior: 'smooth' }); // 새로 검색 시 상단스크롤
    setSearchValue(value); // value값 변경
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
      <AnimatePresence key={router.asPath} exitBeforeEnter>
        <ChildrenWrapperDivStyled
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.4,
          }}
          id="main-content"
        >
          <Search searchValue={searchValue} />
        </ChildrenWrapperDivStyled>
      </AnimatePresence>
      <Footer />
    </>
  );
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
