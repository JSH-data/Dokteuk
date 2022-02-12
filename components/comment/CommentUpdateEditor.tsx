import { useState } from 'react';
import { updateComment } from '@utils/commentUtils';
import ButtonComponent from '@components/items/ButtonComponent';
import InputComponent from '@components/items/InputComponent';
import { useSelector } from 'react-redux';
import { RootReducer } from '@store/reducer';

type CommentUpdateEditorProps = {
  originComment: string;
  commentId: string;
  setModify: (v: boolean) => void;
};

const CommentUpdateEditor: React.FC<CommentUpdateEditorProps> = ({
  originComment,
  commentId,
  setModify,
}) => {
  const [revisedComment, setRevisedComment] = useState<string>(originComment);

  const userInfo = useSelector((state: RootReducer) => state.user.user);

  const commentUpdate = () => {
    const timeStamp = new Date();
    updateComment(revisedComment, commentId, timeStamp);
    setRevisedComment('');
    setModify(false);
  };

  return (
    <>
      <InputComponent
        placeholder="수정할 댓글을 입력해주세요"
        defaultValue={revisedComment}
        changeFn={setRevisedComment}
      />
      <ButtonComponent text="수정하기" activeFn={commentUpdate} />
    </>
  );
};

export default CommentUpdateEditor;
