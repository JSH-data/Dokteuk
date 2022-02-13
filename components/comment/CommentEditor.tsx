import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import setCurrentDate from '@utils/setCurrentDate';
import { addOriginComment, addNestedComment } from '@utils/commentUtils';
import InputComponent from '@components/items/InputComponent';
import ButtonComponent from '@components/items/ButtonComponent';
import { useSelector } from 'react-redux';
import { RootReducer } from '@store/reducer';

const CommentEditorSection = styled.section`
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  & button {
    min-width: 90px;
    margin-left: 10px;
  }
`;

type CommentEditorProps = {
  postId: string;
  bundleId?: number;
  setNestedReply?: (v: boolean) => void;
};

const CommentEditor: React.FC<CommentEditorProps> = ({
  postId,
  bundleId,
  setNestedReply,
}) => {
  const [comment, setComment] = useState<string>('');

  const userInfo = useSelector((state: RootReducer) => state.user.user);

  const addComment = async () => {
    const timeStamp = new Date();

    const detailTimeStamp = timeStamp.getTime();

    if (!bundleId) {
      bundleId = detailTimeStamp;
      addOriginComment(comment, postId, userInfo, bundleId);
    } else {
      addNestedComment(
        comment,
        bundleId,

        detailTimeStamp,
        userInfo,
        postId,
      );
      if (setNestedReply != undefined) setNestedReply(false);
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
