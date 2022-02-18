import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { addOriginComment, addNestedComment } from '@utils/commentUtils';
import CommentInputComponent from '@components/items/CommentInputComponent';
import ButtonComponent from '@components/items/ButtonComponent';
import { useSelector } from 'react-redux';
import { RootReducer } from '@store/reducer';
import { AlertColor } from '@mui/material';
import AlertComponent from '@components/items/AlertComponent';
import {
  postOwnerNotificationUpdate,
  commentOwnerNotificationUpdate,
} from '@utils/notificationUpdate';
import { useRouter } from 'next/router';
import { PostData } from '@interface/comment';

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
  postData: PostData;
  bundleId?: number;
  setNestedReply?: (v: boolean) => void;
  userId?: string;
  originComment?: string;
};
interface Alert {
  alerMessage: string;
  alerType: AlertColor | undefined;
}

const CommentEditor: React.FC<CommentEditorProps> = ({
  postData,
  bundleId,
  setNestedReply,
  userId,
  originComment,
}) => {
  const [comment, setComment] = useState<string>('');
  const [alert, setAlert] = useState<boolean>(false);
  const [timer_, setTimer_] = useState<null | NodeJS.Timeout>(null);
  const [alertInfo, setAlertInfo] = useState<Alert>({
    alerMessage: '',
    alerType: undefined,
  });
  const userInfo = useSelector((state: RootReducer) => state.user.user);

  const router = useRouter();

  const getAlertInfo = (result: string) => {
    if (result === 'success') {
      setAlertInfo({
        alerMessage: '댓글 작성 성공!',
        alerType: 'success',
      });
    } else {
      setAlertInfo({
        alerMessage: '댓글 작성 실패!',
        alerType: 'error',
      });
    }
    setAlert(true);
    setTimer_(
      setTimeout(() => {
        setAlert(false);
        setAlertInfo({
          alerMessage: '',
          alerType: undefined,
        });
      }, 2000),
    );
  };

  const addComment = async () => {
    if (comment.replace(' ', '') == '') return;

    const timeStamp = new Date();

    const detailTimeStamp = timeStamp.getTime();

    if (!bundleId) {
      // bundleId가 없다는 것은 대댓글이 아니라는 의미
      bundleId = detailTimeStamp;
      const result = await addOriginComment(
        comment,
        postData.id,
        userInfo,
        bundleId,
      ); // 댓글 생성
      if (userInfo.id !== postData.ownerId) {
        // 댓글을 생성하고 댓글자와 포스트자가 동일하지 않다면 포스트 주인의 상태를 업데이트합니다.
        await postOwnerNotificationUpdate(postData, router.asPath, comment);
      }
      getAlertInfo(result);
    } else if (userId != undefined && originComment != undefined) {
      // 대댓글인경우 원댓글의 주인의 아이디와 코멘트가 있다
      const result = await addNestedComment(
        comment,
        bundleId,
        detailTimeStamp,
        userInfo,
        postData.id,
      );

      if (userInfo.id !== userId) {
        // 대댓글 작성자원 원댓글 작성자가 동일하지 않은 경우에만 원댓글 작성자의 상태를 업데이트 합니다.
        await commentOwnerNotificationUpdate(
          userId,
          router.asPath,
          postData,
          comment,
          originComment,
        );
      }
      getAlertInfo(result);
      // if (setNestedReply != undefined) setNestedReply(false);
    }
    setComment('');
  };

  useEffect(() => {
    return () => {
      if (timer_ !== null) clearTimeout(timer_);
      setTimer_(null);
    };
  }, []);

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
