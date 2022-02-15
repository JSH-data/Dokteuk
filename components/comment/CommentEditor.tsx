import React, { useState } from 'react';
import styled from '@emotion/styled';
import { addOriginComment, addNestedComment } from '@utils/commentUtils';
import CommentInputComponent from '@components/items/CommentInputComponent';
import ButtonComponent from '@components/items/ButtonComponent';
import { useSelector } from 'react-redux';
import { RootReducer } from '@store/reducer';
import { AlertColor } from '@mui/material';
import AlertComponent from '@components/items/AlertComponent';

const CommentEditorSection = styled.section`
  display: flex;
  align-items: center;
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
interface Alert {
  alerMessage: string;
  alerType: AlertColor | undefined;
}

const CommentEditor: React.FC<CommentEditorProps> = ({
  postId,
  bundleId,
  setNestedReply,
}) => {
  const [comment, setComment] = useState<string>('');
  const [alert, setAlert] = useState<boolean>(false);

  const [alertInfo, setAlertInfo] = useState<Alert>({
    alerMessage: '',
    alerType: undefined,
  });

  const getAlertInfo = (result: string) => {
    setAlert(true);
    if (result === 'success')
      setAlertInfo({
        alerMessage: '댓글 작성 성공!',
        alerType: 'success',
      });
    else {
      setAlertInfo({
        alerMessage: '댓글 작성 실패!',
        alerType: 'error',
      });
    }
    setTimeout(() => {
      setAlert(false);
      setAlertInfo({
        alerMessage: '',
        alerType: undefined,
      });
    }, 2000);
  };

  const userInfo = useSelector((state: RootReducer) => state.user.user);

  const addComment = async () => {
    if (comment.replace(' ', '') == '') return;

    const timeStamp = new Date();

    const detailTimeStamp = timeStamp.getTime();

    if (!bundleId) {
      bundleId = detailTimeStamp;
      const result = await addOriginComment(
        comment,
        postId,
        userInfo,
        bundleId,
      );
      getAlertInfo(result);
    } else {
      const result = await addNestedComment(
        comment,
        bundleId,
        detailTimeStamp,
        userInfo,
        postId,
      );
      getAlertInfo(result);
      if (setNestedReply != undefined) setNestedReply(false);
    }
    setComment('');
  };

  return (
    <CommentEditorSection>
      {bundleId && (
        <div
          style={{ cursor: 'pointer', marginRight: '8px' }}
          onClick={() => {
            if (setNestedReply != undefined) setNestedReply(false);
          }}
        >
          X
        </div>
      )}
      <CommentInputComponent
        defaultValue={comment}
        placeholder="댓글을 입력하세요"
        changeFn={setComment}
      />
      <ButtonComponent text="답변하기" activeFn={addComment}></ButtonComponent>
      {alert && (
        <AlertComponent
          alerMessage={alertInfo.alerMessage}
          alerType={alertInfo.alerType}
        />
      )}
    </CommentEditorSection>
  );
};

export default CommentEditor;
