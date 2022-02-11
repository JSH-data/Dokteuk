import styled from '@emotion/styled';
import { getDateTime } from '@utils/function';
//@ts-ignore
import { TopicPost, RoungePost } from '@interface/CardInterface';
import Link from 'next/link';
import { ForwardedRef, forwardRef } from 'react';
// import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import { useInView } from 'react-intersection-observer';
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const CardWrapper = styled.div`
  background-color: ${({ theme }: any) =>
    theme.customTheme.defaultMode.cardWrapperBackgroundColor};
  height: 200px;
  border-radius: 10px;
  margin: 17px 8px 0 8px;
  padding: 12px 24px;
  cursor: pointer;
  display: grid;
  justify-content: center;
  align-items: center;
  max-width: 680px;
  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }: any) =>
      theme.customTheme.darkMode.cardWrapperBackgroundColor};
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
    background-color: ${({ theme }: any) =>
      theme.customTheme.defaultMode.topicWrapperBackgroundColor};
    border-radius: 20px;
    padding: 4px 12px 4px 12px;
    color: ${({ theme }: any) =>
      theme.customTheme.defaultMode.topicWrapperTextColor};
  }
  @media (prefers-color-scheme: dark) {
    & div {
      background-color: ${({ theme }: any) =>
        theme.customTheme.darkMode.topicWrapperBackgroundColor};
      color: ${({ theme }: any) =>
        theme.customTheme.darkMode.topicWrapperTextColor};
      // color: red;
    }
  }
`;

const CardDividerStyled = styled.div`
  width: calc(100% + 48px);
  background-color: rgb(39, 39, 41);
  height: 0.5px;
  margin-left: -24px;
  margin-top: 8px;
  margin-bottom: 8px;
`;
const CardTitleStyled = styled.div`
  font-size: 1.5rem;
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
`;
const CardStatWrapper = styled.div`
  font-size: 1rem;
  margin-right: 1rem;
`;
const ThumbUpIconStyled = styled(ThumbUpIcon)`
  font-size: 1rem;
  margin-right: 0.5rem;
  // color: rgb(144, 202, 249);
  color: rgb(66, 103, 178);
`;
const ModeCommentIconStyled = styled(ModeCommentIcon)`
  font-size: 1rem;
  margin-right: 0.5rem;
`;

export const RoungeCard = forwardRef(function RoungeCardWithRef(
  {
    roungeCardData,
  }: {
    roungeCardData: RoungePost;
  },
  ref?: ForwardedRef<any>,
) {
  const { ref: cardRef, inView } = useInView();
  return (
    <Wrapper>
      <div ref={ref} />
      <Link href={`/rounge/posts/${roungeCardData.postId}`} passHref>
        <CardWrapper>
          {
            <>
              <CardTitleStyled>{roungeCardData.title}</CardTitleStyled>
              <CardContentStyled>{roungeCardData.content}</CardContentStyled>
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
              <CardDividerStyled />
              <CardBottomWrapperStyled>
                <CardStatWrapper>
                  <ThumbUpIconStyled />
                  {roungeCardData.likeCount === 0
                    ? '좋아요'
                    : roungeCardData.likeCount}
                </CardStatWrapper>
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
          }
        </CardWrapper>
      </Link>
    </Wrapper>
  );
});

export const TopicCard = forwardRef(function TopicCardWithRef(
  {
    topicCardData,
  }: {
    topicCardData: TopicPost;
  },
  ref?: any,
) {
  const { ref: cardRef, inView } = useInView();

  // console.log(Object.keys(topicCardData));
  return (
    <Wrapper>
      <div ref={ref} />
      <Link href={`/topic/posts/${topicCardData.postId}`} passHref>
        <CardWrapper>
          {
            <>
              <OneDepthNestedLink href={`/topic/${topicCardData.topic.url}`}>
                <TopicWrapperDivStyled>
                  <div>{topicCardData.topic.title}</div>
                </TopicWrapperDivStyled>
              </OneDepthNestedLink>
              <CardTitleStyled>{topicCardData.title}</CardTitleStyled>
              <CardContentStyled>{topicCardData.content}</CardContentStyled>
              <br />
              <div style={{ fontSize: '0.8rem', color: 'rgb(78, 85, 101)' }}>
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
