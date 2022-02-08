import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import setCurrentDate from '@utils/setCurrentDate';
import { addOriginComment, addNestedComment } from '@utils/commentUtils';
import InputComponent from '@components/items/InputComponent';
import ButtonComponent from '@components/items/ButtonComponent';

const CommentEditorSection = styled.section`
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  & button {
    min-width: 90px;
  }
`;

type CommentEditorProps = {
  bundleId?: number;
  postId: string;
};

const CommentEditor: React.FC<CommentEditorProps> = ({ bundleId, postId }) => {
  const [comment, setComment] = useState<string>('');

  const inputRef = useRef<HTMLElement>(null);

  const addComment = async () => {
    const timeStamp = new Date();

    const detailTimeStamp = timeStamp.getTime();

    const currentDate = setCurrentDate(timeStamp);

    if (!bundleId) {
      bundleId = detailTimeStamp;
      addOriginComment(comment, currentDate, postId, bundleId);
    } else {
      addNestedComment(comment, bundleId, currentDate, detailTimeStamp, postId);
    }
    setComment('');
  };

  return (
    <CommentEditorSection>
      <InputComponent
        defaultValue={comment}
        placeholder="댓글을 입력하세요"
        changeFn={setComment}
      />
      <ButtonComponent text="답변하기" activeFn={addComment}></ButtonComponent>
    </CommentEditorSection>
  );
};

export default CommentEditor;
