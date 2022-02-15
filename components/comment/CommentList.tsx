import React, { useEffect, useState } from 'react';
import Comment from './CommentComponent';
import styled from '@emotion/styled';
import { onSnapshot } from 'firebase/firestore';
import { commentQuery } from '@firebase/firebase';

const CommentListDiv = styled.div`
  width: 100%;
`;

type CommentListProps = {
  setSum(s: number): void;
  postId: string;
  userId?: string;
};

const CommentList: React.FC<CommentListProps> = ({
  setSum,
  postId,
  userId,
}) => {
  const [comments, setComments] = useState<any>([]); // todo: 타입 지정

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unSubscribe = onSnapshot(commentQuery(postId), (snapshot) => {
      const newData = snapshot.docs.map((value) => ({
        id: value.id,
        ...value.data(),
      }));

      setComments(newData);
      setSum(newData.length);
      setLoading(false);
    });

    return () => unSubscribe();
  }, []);

  const isClicked = (arr: any) => (arr.indexOf(userId) === -1 ? false : true); // todo: 타입 지정

  if (loading) {
    return <div style={{ marginBottom: '20px' }}>댓글을 불러오는 중...</div>;
  }

  return (
    <CommentListDiv>
      {comments.length == 0 ? (
        <div style={{ marginBottom: '20px' }}>등록된 댓글이 없습니다.</div>
      ) : (
        comments.map((data: any) => {
          // todo: 타입 지정
          return (
            <Comment
              key={data.id}
              text={data.text}
              likes={data.likes}
              nickname={data.nickname}
              job={data.job}
              date={data.createdAt}
              isClicked={isClicked(data.pressedPerson)}
              commentId={data.id}
              isNested={data.origin}
              bundleId={data.bundleId}
              isDeleted={data.isDeleted}
              postId={postId}
              userId={data.userId}
            />
          );
        })
      )}
    </CommentListDiv>
  );
};

export default CommentList;
