import React, { useState } from 'react';
import styled from '@emotion/styled';
import LikeComponent from './CommentLikeComponent';
import CommentTextComponent from './CommentTextComponent';
import CommentAuthorComponent from './CommentAuthorComponent';
import MenuIcon from '@mui/icons-material/Menu';
import CommentDropBox from './CommentDropBoxComponent';
import CommentEditor from './CommentEditor';

type CommentProps = {
  text: string;
  likes: number;
  nickname: string;
  job: string;
  date: string;
  isClicked: boolean;
  id: string;
  isNested: boolean;
  bundleId: number;
  isDeleted: boolean;
  postId: string;
};

const CommentDiv = styled.div<{ isClicked: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #8946a6;
  margin-bottom: 20px;
`;

const NestedCommentDiv = styled.div<{ isClicked: boolean }>`
  width: 80%;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  margin-left: auto;
  border-bottom: 1px solid #8946a6;
`;

const deleteMessage = '삭제된 메시지입니다.';

const Comment: React.FC<CommentProps> = ({
  text,
  likes,
  nickname,
  job,
  date,
  isClicked,
  id,
  isNested,
  bundleId,
  isDeleted,
  postId,
}) => {
  const [menu, setMenu] = useState(false);

  const [nestedReplyEditor, setNestedReplyEditor] = useState(false);

  const [modify, setModify] = useState(false);

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
              <LikeComponent likes={likes} isClicked={isClicked} id={id} />
              <MenuIcon onClick={() => setMenu(!menu)} />
              {!isDeleted && menu && (
                <CommentDropBox
                  setNestedReply={setNestedReplyEditor}
                  setMenu={setMenu}
                  setModify={setModify}
                  id={id}
                />
              )}
            </div>
          )}
          <CommentTextComponent
            commentText={isDeleted ? deleteMessage : text}
            modify={modify}
            id={id}
            setModify={setModify}
          ></CommentTextComponent>
          <CommentAuthorComponent
            nickname={nickname}
            job={job}
            date={date}
          ></CommentAuthorComponent>
          {nestedReplyEditor && (
            <CommentEditor
              bundleId={bundleId}
              postId={postId}
              setNestedReply={setNestedReplyEditor}
            />
          )}
        </CommentDiv>
      ) : (
        <NestedCommentDiv isClicked={isClicked}>
          {!modify && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <LikeComponent likes={likes} isClicked={isClicked} id={id} />
              <MenuIcon onClick={() => setMenu(!menu)} />
              {!isDeleted && menu && (
                <CommentDropBox
                  setMenu={setMenu}
                  setModify={setModify}
                  id={id}
                />
              )}
            </div>
          )}
          <CommentTextComponent
            modify={modify}
            setModify={setModify}
            id={id}
            commentText={isDeleted ? deleteMessage : text}
          ></CommentTextComponent>
          <CommentAuthorComponent
            nickname={nickname}
            job={job}
            date={date}
          ></CommentAuthorComponent>
        </NestedCommentDiv>
      )}
    </>
  );
};

export default Comment;
