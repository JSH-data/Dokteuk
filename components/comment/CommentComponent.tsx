import React, { useState } from 'react';
import styled from '@emotion/styled';
import LikeComponent from './CommentLikeComponent';
import CommentTextComponent from './CommentTextComponent';
import CommentAuthorComponent from './CommentAuthorComponent';
import MenuIcon from '@mui/icons-material/Menu';
import CommentDropBox from './CommentDropBoxComponent';
import CommentEditor from './CommentEditor';
import { useSelector } from 'react-redux';
import { RootReducer } from '@store/reducer';
import { PostData } from '@interface/comment';
import Image from 'next/image';
import enterArrow from '@public/enterArrow.png';

type CommentProps = {
  text: string;
  likes: number;
  nickname: string;
  job: string;
  date: string;
  isClicked: boolean;
  commentId: string;
  isNested: boolean;
  bundleId: number;
  isDeleted: boolean;
  userId: string;
  postData: PostData;
};

const ImageWrapper = styled.div`
  flex: 1;
  padding: 0 0 20px 20px;
  & .enter {
    @media (prefers-color-scheme: dark) {
      -webkit-filter: opacity(0.5) drop-shadow(0 0 0 white);
      filter: opacity(0.5) drop-shadow(0 0 0 white);
    }
  }
`;

const CommentDiv = styled.div<{ isClicked: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${({ theme }: any) => theme.mainColorViolet};
  margin-bottom: 20px;

  @media (prefers-color-scheme: dark) {
    border-bottom: 1px solid ${({ theme }: any) => theme.mainColorBlue};
  }
`;

const NestedCommentDiv = styled.div<{ isClicked: boolean }>`
  flex: 5;
  width: 80%;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  margin-left: auto;
  border-bottom: 1px solid ${({ theme }: any) => theme.mainColorViolet};

  @media (prefers-color-scheme: dark) {
    border-bottom: 1px solid ${({ theme }: any) => theme.mainColorBlue};
  }
`;

const deleteMessage = '삭제된 메시지입니다.';

const Comment: React.FC<CommentProps> = ({
  text,
  likes,
  nickname,
  job,
  date,
  isClicked,
  commentId,
  isNested,
  bundleId,
  isDeleted,
  userId,
  postData,
}) => {
  const [menu, setMenu] = useState(false);

  const [nestedReplyEditor, setNestedReplyEditor] = useState(false);

  const [modify, setModify] = useState(false);

  const userInfo = useSelector((state: RootReducer) => state.user.user.id);

  return (
    <>
      {isNested ? (
        <CommentDiv isClicked={isClicked}>
          {!modify && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <LikeComponent
                likes={likes}
                isClicked={isClicked}
                commentId={commentId}
                isDeleted={isDeleted}
                userId={userId}
              />
              <MenuIcon
                onClick={() => {
                  setTimeout(() => {
                    setMenu((pre) => !pre);
                  }, 0);
                }}
              />
              {!isDeleted && menu && userInfo && (
                <CommentDropBox
                  setNestedReply={setNestedReplyEditor}
                  setMenu={setMenu}
                  setModify={setModify}
                  commentId={commentId}
                  userId={userId}
                  isNested={isNested}
                />
              )}
            </div>
          )}
          <CommentTextComponent
            commentText={isDeleted ? deleteMessage : text}
            modify={modify}
            commentId={commentId}
            setModify={setModify}
          ></CommentTextComponent>
          <CommentAuthorComponent
            nickname={nickname}
            job={job}
            date={date}
            userId={userId}
          ></CommentAuthorComponent>
          {nestedReplyEditor && (
            <CommentEditor
              bundleId={bundleId}
              setNestedReply={setNestedReplyEditor}
              userId={userId}
              postData={postData}
              originComment={text}
            />
          )}
        </CommentDiv>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ImageWrapper>
            <Image
              className="enter"
              src={enterArrow}
              width="25px"
              height="25px"
            />
          </ImageWrapper>
          <NestedCommentDiv isClicked={isClicked}>
            {!modify && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
              >
                <LikeComponent
                  likes={likes}
                  isClicked={isClicked}
                  commentId={commentId}
                  isDeleted={isDeleted}
                  userId={userId}
                />
                <MenuIcon
                  onClick={() => {
                    setTimeout(() => {
                      setMenu((pre) => !pre);
                    }, 0);
                  }}
                />
                {!isDeleted && menu && userInfo == userId && (
                  <CommentDropBox
                    setMenu={setMenu}
                    setModify={setModify}
                    commentId={commentId}
                    userId={userId}
                    isNested={isNested}
                  />
                )}
              </div>
            )}
            <CommentTextComponent
              modify={modify}
              setModify={setModify}
              commentId={commentId}
              commentText={isDeleted ? deleteMessage : text}
            ></CommentTextComponent>
            <CommentAuthorComponent
              nickname={nickname}
              job={job}
              date={date}
              userId={userId}
            ></CommentAuthorComponent>
          </NestedCommentDiv>
        </div>
      )}
    </>
  );
};

export default Comment;
