import styled from '@emotion/styled';
import { getDateTime } from '@utils/function';
import { TopicPost, RoungePost } from '@interface/CardInterface';
import Link from 'next/link';
import { ForwardedRef, forwardRef } from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { useInView } from 'react-intersection-observer';

import ImgComponent from './items/ImgComponent';
import { useDispatch } from 'react-redux';
import { likeViewPostAction, unLikeViewPostAction } from '@store/reducer';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@firebase/firebase';
import { getAuth } from 'firebase/auth';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const CardWrapper = styled.div`
  width: 100%;
  background-color: white;
  height: 200px;
  border-radius: 10px;
  margin: 17px 8px 0 8px;
  padding: 12px 24px;
  cursor: pointer;
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  align-items: center;
  max-width: 680px;
  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }: any) => theme.mainColorBlack};
  }
`;
const OneDepthNestedLink = styled(Link)`
  z-index: 1;
`;

const TopicWrapperDivStyled = styled.div`
  display: flex;
  & div {
    font-size: 8px;
    font-weight: 500;
    margin-bottom: 4px;
    background-color: ${({ theme }: any) => theme.mainColorViolet};
    border-radius: 20px;
    padding: 4px 12px 4px 12px;
    color: black;
  }
  @media (prefers-color-scheme: dark) {
    & div {
      background-color: ${({ theme }: any) => theme.blackGray};
      color: ${({ theme }: any) => theme.lightGray};
      // color: red;
    }
  }
`;

const CardDividerStyled = styled.div`
  width: calc(100% + 48px);
  background-color: rgb(39, 39, 41);
  height: 0.5px;
  margin-left: -24px;
  margin-bottom: 8px;
`;

const TopicCardMainStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 0px;
`;

const RoungeCardMainStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 0px;
  height: 138px;
`;

const TopicCardContentWrapper = styled.div`
  flex: 2;
`;

const RoungeCardContentWrapper = styled.div`
  padding-top: 5px;
  flex: 2;
`;

const CardTitleStyled = styled.div`
  font-size: 1.5rem;
  margin-bottom: 3px;
  text-overflow: ellipsis;
  overflow: hidden;
  height: calc(1.5rem + 5px);
  word-break: break-all;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
`;

const CardContentStyled = styled.div`
  height: 2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 0.8rem;
  color: rgb(118, 118, 120);
  word-break: break-all;
  -webkit-line-clamp: 2;
`;
const CardAuthorJobSectorStyled = styled.div`
  font-size: 0.8rem;
`;
const CardAuthorJobSectorWrapperStyled = styled.div`
  display: flex;
  align-items: center;
`;
const CardMiddleDotStyled = styled.div`
  font-size: 0.8rem;
  color: rgb(148, 148, 150);
  padding: 0 0.2rem 0 0.2rem;
`;
const CardAuthorNickname = styled.div`
  font-size: 0.6rem;
  color: rgb(184, 191, 210);
`;
const CardBottomWrapperStyled = styled.div`
  display: flex;
  height: 20px;
`;
const CardStatWrapper = styled.div`
  font-size: 1rem;
  margin-right: 1rem;
`;
const ThumbUpIconStyled = styled(ThumbUpIcon)`
  font-size: 1rem;
  margin-right: 0.5rem;
  color: rgb(66, 103, 178);
`;
const ThumbUpOutlinedIconStyled = styled(ThumbUpOutlinedIcon)`
  font-size: 1rem;
  margin-right: 0.5rem;
  color: rgb(66, 103, 178);
`;
const ModeCommentIconStyled = styled(ModeCommentIcon)`
  font-size: 1rem;
  margin-right: 0.5rem;
`;
const CardTitleStyledSkeleton = styled(CardTitleStyled)`
  background-color: gray;
  width: 60%;
  opacity: 0.2;
  border-radius: 10px;
  margin-bottom: 8px;
`;

const CardContentStyledSkeleton = styled(CardContentStyled)`
  background-color: gray;
  height: 1rem;
  width: 80%;
  opacity: 0.2;
  border-radius: 10px;
  margin-bottom: 2px;
`;
const CardContentStyledSkeleton_2 = styled(CardContentStyled)`
  background-color: gray;
  height: 1rem;
  width: 75%;
  opacity: 0.2;
  border-radius: 10px;
`;
const InnerTopicSkeleton = styled.div`
  margin-top: 4px;
  background-color: gray;
  height: 1rem;
  width: 10%;
  opacity: 0.2;
  border-radius: 10px;
`;

const CardAuthorJobSectorStyledSkeleton = styled(CardAuthorJobSectorStyled)`
  margin-top: 8px;
  background-color: gray;
  height: 1rem;
  width: 5%;
  opacity: 0.2;
  border-radius: 10px;
`;
const CardMiddleDotStyledSkeleton = styled(CardMiddleDotStyled)`
  color: gray;
  opacity: 0.4;
`;
const CardAuthorNicknameSkeleton = styled(CardAuthorNickname)`
  margin-top: 8px;
  background-color: gray;
  height: 1rem;
  width: 5%;
  opacity: 0.2;
  border-radius: 10px;
`;
const CardDividerStyledSkeleton = styled(CardDividerStyled)`
  color: gray;
  opacity: 0.1;
  margin-top: 4px;
`;
const CardStatWrapperSkeleton = styled(CardStatWrapper)`
  padding: 0 8px 0 8px;
  background-color: gray;
  opacity: 0.2;
  border-radius: 10px;
`;
const ThumbUpIconStyledSkeleton = styled(ThumbUpIconStyled)`
  opacity: 0.8;
  background-color: black;
  border-radius: 10px;
  color: gray;
`;
const ModeCommentIconStyledSkeleton = styled(ModeCommentIconStyled)`
  opacity: 0.5;
  background-color: gray;
  border-radius: 10px;
`;
const DateDiffStyledSkeleton = styled.div`
  margin-left: auto;
  background-color: gray;
  width: 10%;
  opacity: 0.2;
  border-radius: 10px;
`;
const CardWrapperSkeleton = styled(CardWrapper)`
  height: auto;
`;
const CardStatWrapperLike = styled(CardStatWrapper)`
  z-index: 1;
`;

export const RoungeCard = forwardRef(function RoungeCardWithRef(
  {
    roungeCardData,
    isLiked = false,
  }: {
    roungeCardData: RoungePost;
    isLiked: boolean;
  },
  ref?: ForwardedRef<any>,
) {
  const dispatch = useDispatch();

  const { ref: cardRef, inView } = useInView();
  return (
    <Wrapper ref={cardRef}>
      {/* <Wrapper> */}
      <Link
        href={`/list/rounge/${roungeCardData.rounge.url}/${roungeCardData.postId}`}
        passHref
      >
        <CardWrapper>
          {inView ? (
            <>
              <div ref={ref} style={{ display: 'contents' }} />
              <RoungeCardMainStyled>
                <RoungeCardContentWrapper>
                  <CardTitleStyled>{roungeCardData.title}</CardTitleStyled>
                  <br />
                  <CardContentStyled>
                    {roungeCardData.content}
                  </CardContentStyled>
                  <br />

                  <CardAuthorJobSectorWrapperStyled>
                    <CardAuthorJobSectorStyled>
                      {roungeCardData.author.jobSector}
                    </CardAuthorJobSectorStyled>
                    <CardMiddleDotStyled>·</CardMiddleDotStyled>
                    <CardAuthorNickname>
                      {roungeCardData.author.nickname}
                    </CardAuthorNickname>
                  </CardAuthorJobSectorWrapperStyled>
                </RoungeCardContentWrapper>
                {roungeCardData.images.length !== 0 && (
                  <ImgComponent urls={roungeCardData.images} />
                )}
              </RoungeCardMainStyled>

              <CardDividerStyled />
              <CardBottomWrapperStyled>
                <CardStatWrapperLike
                  onClick={async (e) => {
                    e.stopPropagation();
                    const currentUser = getAuth().currentUser;
                    if (currentUser) {
                      if (isLiked) {
                        const docRef = doc(db, 'post', roungeCardData.postId);
                        const { uid } = currentUser;
                        const updatePressPerson =
                          roungeCardData.pressPerson.filter(
                            (person) => person !== uid,
                          );
                        await updateDoc(docRef, {
                          pressPerson: updatePressPerson,
                        });
                        dispatch(
                          unLikeViewPostAction({
                            postId: roungeCardData.postId,
                            userId: uid,
                          }),
                        );
                      } else {
                        const docRef = doc(db, 'post', roungeCardData.postId);
                        const { uid } = currentUser;
                        const updatePressPerson = [
                          ...roungeCardData.pressPerson,
                          uid,
                        ];
                        await updateDoc(docRef, {
                          pressPerson: updatePressPerson,
                        });
                        dispatch(
                          likeViewPostAction({
                            postId: roungeCardData.postId,
                            userId: uid,
                          }),
                        );
                      }
                    }
                  }}
                >
                  {isLiked ? (
                    <ThumbUpIconStyled />
                  ) : (
                    <ThumbUpOutlinedIconStyled />
                  )}

                  {roungeCardData.likeCount === 0
                    ? '좋아요'
                    : roungeCardData.likeCount}
                </CardStatWrapperLike>
                <CardStatWrapper>
                  <ModeCommentIconStyled />
                  {roungeCardData.commentsCount === 0
                    ? '댓글'
                    : roungeCardData.commentsCount}
                </CardStatWrapper>
                <div style={{ marginLeft: 'auto' }}>
                  {getDateTime(roungeCardData.createdAt)}
                </div>
              </CardBottomWrapperStyled>
            </>
          ) : (
            <>
              <div ref={ref} />
              <CardSkeleton />
            </>
          )}
        </CardWrapper>
      </Link>
    </Wrapper>
  );
});

const CardSkeleton = () => {
  return (
    <Wrapper>
      <CardWrapperSkeleton>
        <TopicCardMainStyled>
          <TopicCardContentWrapper>
            <CardTitleStyledSkeleton />
            <CardContentStyledSkeleton />
            <CardContentStyledSkeleton_2 />
            <InnerTopicSkeleton />
            <CardAuthorJobSectorWrapperStyled>
              <CardAuthorJobSectorStyledSkeleton />
              <CardMiddleDotStyledSkeleton>·</CardMiddleDotStyledSkeleton>
              <CardAuthorNicknameSkeleton />
            </CardAuthorJobSectorWrapperStyled>
          </TopicCardContentWrapper>
        </TopicCardMainStyled>
        <CardDividerStyledSkeleton />
        <CardBottomWrapperStyled>
          <CardStatWrapperSkeleton>
            <ThumbUpIconStyledSkeleton />
            좋아요
          </CardStatWrapperSkeleton>
          <CardStatWrapperSkeleton>
            <ModeCommentIconStyledSkeleton />
            댓글
          </CardStatWrapperSkeleton>
          <DateDiffStyledSkeleton />
        </CardBottomWrapperStyled>
      </CardWrapperSkeleton>
    </Wrapper>
  );
};

export const TopicCard = forwardRef(function TopicCardWithRef(
  {
    topicCardData,
    isLiked = false,
  }: {
    topicCardData: TopicPost;
    isLiked: boolean;
  },
  ref?: any,
) {
  const dispatch = useDispatch();
  const { ref: cardRef, inView } = useInView();
  // @ts-ignore
  // console.log(topicCardData.pressPerson);
  // console.log(Object.keys(topicCardData));
  return (
    <Wrapper ref={cardRef}>
      {/* <Wrapper> */}
      <Link
        href={`/list/topic/${topicCardData.topic.url}/${topicCardData.postId}`}
        passHref
      >
        <CardWrapper>
          {inView ? (
            <>
              <div ref={ref} />
              <TopicCardMainStyled>
                <TopicCardContentWrapper>
                  <OneDepthNestedLink
                    href={`/list/topic/${topicCardData.topic.url}`}
                  >
                    <TopicWrapperDivStyled>
                      <div>{topicCardData.topic.title}</div>
                    </TopicWrapperDivStyled>
                  </OneDepthNestedLink>
                  <CardTitleStyled>{topicCardData.title}</CardTitleStyled>
                  <CardContentStyled>{topicCardData.content}</CardContentStyled>

                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'rgb(78, 85, 101)',
                      alignSelf: 'start',
                      marginTop: '10px', // 수정
                    }}
                  >
                    토픽
                  </div>
                  <CardAuthorJobSectorWrapperStyled>
                    <CardAuthorJobSectorStyled>
                      {topicCardData.author.jobSector}
                    </CardAuthorJobSectorStyled>
                    <CardMiddleDotStyled>·</CardMiddleDotStyled>
                    <CardAuthorNickname>
                      {topicCardData.author.nickname}
                    </CardAuthorNickname>
                  </CardAuthorJobSectorWrapperStyled>
                </TopicCardContentWrapper>
                {topicCardData.images.length !== 0 && (
                  <ImgComponent urls={topicCardData.images} />
                )}
              </TopicCardMainStyled>
              <CardDividerStyled />
              <CardBottomWrapperStyled>
                <CardStatWrapperLike
                  onClick={async (e) => {
                    e.stopPropagation();
                    const currentUser = getAuth().currentUser;
                    if (currentUser) {
                      if (isLiked) {
                        const docRef = doc(db, 'post', topicCardData.postId);
                        const { uid } = currentUser;
                        const updatePressPerson =
                          topicCardData.pressPerson.filter(
                            (person) => person !== uid,
                          );
                        await updateDoc(docRef, {
                          pressPerson: updatePressPerson,
                        });
                        dispatch(
                          unLikeViewPostAction({
                            postId: topicCardData.postId,
                            userId: uid,
                          }),
                        );
                      } else {
                        const docRef = doc(db, 'post', topicCardData.postId);
                        const { uid } = currentUser;
                        const updatePressPerson = [
                          ...topicCardData.pressPerson,
                          uid,
                        ];
                        await updateDoc(docRef, {
                          pressPerson: updatePressPerson,
                        });
                        dispatch(
                          likeViewPostAction({
                            postId: topicCardData.postId,
                            userId: uid,
                          }),
                        );
                      }
                    }
                  }}
                >
                  {isLiked ? (
                    <ThumbUpIconStyled />
                  ) : (
                    <ThumbUpOutlinedIconStyled />
                  )}

                  {topicCardData.likeCount === 0
                    ? '좋아요'
                    : topicCardData.likeCount}
                </CardStatWrapperLike>
                <CardStatWrapper>
                  <ModeCommentIconStyled />
                  {topicCardData.commentsCount === 0
                    ? '댓글'
                    : topicCardData.commentsCount}
                </CardStatWrapper>
                <div style={{ marginLeft: 'auto' }}>
                  {getDateTime(topicCardData.createdAt)}
                </div>
              </CardBottomWrapperStyled>
            </>
          ) : (
            <>
              <div ref={ref} />
              <CardSkeleton />
            </>
          )}
        </CardWrapper>
      </Link>
    </Wrapper>
  );
});

export const TestTopicCard = forwardRef(function TopicCardWithRef(
  {
    topicCardData,
  }: {
    topicCardData: TopicPost;
  },
  ref?: any,
) {
  // const { ref: cardRef, inView } = useInView();
  // console.log(Object.keys(topicCardData));
  return (
    // <Wrapper ref={cardRef}>
    <Wrapper>
      <Link
        href={`/list/topic/${topicCardData.topic.url}/${topicCardData.postId}`}
        // href={'/test'}
        passHref
      >
        <CardWrapper>
          {/* {inView && ( */}
          {
            <>
              <div ref={ref} />
              <TopicCardMainStyled>
                <TopicCardContentWrapper>
                  <CardTitleStyled>{topicCardData.title}</CardTitleStyled>
                  <br />

                  <CardContentStyled>{topicCardData.content}</CardContentStyled>
                  <br />
                  <CardAuthorJobSectorWrapperStyled>
                    <CardAuthorJobSectorStyled>
                      {topicCardData.author.jobSector}
                    </CardAuthorJobSectorStyled>
                    <CardMiddleDotStyled>·</CardMiddleDotStyled>
                    <CardAuthorNickname>
                      {topicCardData.author.nickname}
                    </CardAuthorNickname>
                  </CardAuthorJobSectorWrapperStyled>
                </TopicCardContentWrapper>
                {topicCardData.images.length !== 0 && (
                  <ImgComponent urls={topicCardData.images} />
                )}
              </TopicCardMainStyled>
              <CardDividerStyled />
              <CardBottomWrapperStyled>
                <CardStatWrapper>
                  <ThumbUpIconStyled />
                  {topicCardData.likeCount === 0
                    ? '좋아요'
                    : topicCardData.likeCount}
                </CardStatWrapper>
                <CardStatWrapper>
                  <ModeCommentIconStyled />
                  {topicCardData.commentsCount === 0
                    ? '댓글'
                    : topicCardData.commentsCount}
                </CardStatWrapper>
                <div style={{ marginLeft: 'auto' }}>
                  {getDateTime(topicCardData.createdAt)}
                </div>
              </CardBottomWrapperStyled>
            </>
          }
        </CardWrapper>
      </Link>
    </Wrapper>
  );
});
