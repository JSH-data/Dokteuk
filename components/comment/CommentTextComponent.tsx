import styled from '@emotion/styled';
import React from 'react';
import CommentUpdateEditor from './CommentUpdateEditor';

const CommentTextDiv = styled.div`
  margin-bottom: 25px;
  font-size: 1rem;
  display: flex;
  align-items: center;

  & div {
    margin-right: 1rem;
  }

  & button {
    min-width: 90px;
  }
`;

type CommentProps = {
  commentText: string;
  modify: boolean;
  commentId: string;
  setModify: (v: boolean) => void;
};

const CommentTextComponent: React.FC<CommentProps> = ({
  commentText,
  modify,
  commentId,
  setModify,
}) => {
  return (
    <CommentTextDiv>
      {modify ? (
        <>
          <div style={{ cursor: 'pointer' }} onClick={() => setModify(false)}>
            X
          </div>
          <CommentUpdateEditor
            setModify={setModify}
            originComment={commentText}
            commentId={commentId}
          />
        </>
      ) : (
        <span>{commentText}</span>
      )}
    </CommentTextDiv>
  );
};

export default CommentTextComponent;
