import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@firebase/firebase';

const CommentHeader = styled.h1`
  display: flex;
  width: 80%;
  align-items: flex-end;
  & span {
    font-weight: 300;
    font-size: 1.2rem;
  }
  margin-bottom: 10px;
`;

type CommentSumProps = {
  sum: number;
  postId: string;
};

const CommentSum: React.FC<CommentSumProps> = ({ sum, postId }) => {
  const [startUpdate, setStartUpdate] = useState<number>(0);
  const postCommentCountUpdate = async () => {
    const postRef = doc(db, 'post', postId);
    await updateDoc(postRef, {
      commentsCount: sum,
    });
  };
  useEffect(() => {
    if (startUpdate < 2) {
      setStartUpdate((pre) => pre + 1);
    } else {
      postCommentCountUpdate();
    }
  }, [sum]);
  return (
    <>
      <CommentHeader>
        {sum}
        <span>{` `}개의 댓글</span>
      </CommentHeader>
    </>
  );
};

export default CommentSum;
