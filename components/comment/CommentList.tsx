import React, { useEffect, useState } from 'react';
import Comment from './CommentComponent';
import styled from '@emotion/styled';
import { query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { commentRef } from '@firebase/firebase';

const CommentListDiv = styled.div`
  width: 100%;
`;

type CommentListProps = {
  setSum(s: number): void;
  id: string;
};

const CommentList: React.FC<CommentListProps> = ({ setSum, id }) => {
  const [comments, setComments] = useState<any>([]); // todo: 타입 지정
  const [userId, setUserId] = useState('user'); // 추후 전역으로 들고 있어야할 user의 아이디, 추가적으로 닉네임, job등등...

  useEffect(() => {
    const q = query(
      commentRef,
      where('post_id', '==', `${id}`),
      orderBy('bundle_id'),
      orderBy('bundle_order'),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newData = snapshot.docs.map((value) => ({
        id: value.id,
        ...value.data(),
      }));
      console.log(newData);
      setComments(newData);
      setSum(newData.length);
    });

    return () => unsubscribe();
  }, []);

  const isClicked = (arr: any) => (arr.indexOf(userId) === -1 ? false : true); // todo: 타입 지정

  return (
    <CommentListDiv>
      {comments.length == 0 ? (
        <>댓글이 아직 등록되지 않았습니다. 댓글을 입력해주세요</>
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
              date={data.created_at}
              isClicked={isClicked(data.pressed_person)}
              id={data.id}
              isNested={data.origin}
              bundleId={data.bundle_id}
              isDeleted={data.is_deleted}
              postId={id}
            />
          );
        })
      )}
    </CommentListDiv>
  );
};

export default CommentList;
