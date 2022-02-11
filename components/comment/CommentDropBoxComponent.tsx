import React, { useRef, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@firebase/firebase';
import styled from '@emotion/styled';

type CommentDropBoxProps = {
  setNestedReply?: (v: boolean) => void;
  setMenu(v: boolean): void;
  setModify(v: boolean): void;
  id: string;
};

const CommentDropBoxDiv = styled.div`
  background-color: white;
  border: 1px solid grey;
  border-radius: 10px;
  width: 100px;
  text-align: center;
  position: absolute;
  right: 0;
  top: 20px;
`;

const CommentDropBoxOption = styled.div`
  cursor: pointer;
`;

const CommentDropBox: React.FC<CommentDropBoxProps> = ({
  setNestedReply,
  setMenu,
  setModify,
  id,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const deleteComment = async () => {
    const commentref = doc(db, 'comment', id);
    await updateDoc(commentref, {
      is_deleted: true,
    });
  };

  useEffect(() => {
    window.addEventListener('click', (event: MouseEvent) =>
      handleClickOutside(event),
    );
    return () => {
      window.removeEventListener('click', (event: MouseEvent) =>
        handleClickOutside(event),
      );
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node))
      setMenu(false);
  };

  return (
    <CommentDropBoxDiv ref={menuRef}>
      {setNestedReply && (
        <CommentDropBoxOption
          onClick={() => {
            setNestedReply(true);
            setMenu(false);
          }}
        >
          대댓글 달기
        </CommentDropBoxOption>
      )}

      <CommentDropBoxOption
        onClick={() => {
          setModify(true);
          setMenu(false);
        }}
      >
        수정하기
      </CommentDropBoxOption>

      <CommentDropBoxOption
        onClick={() => {
          deleteComment();
          setMenu(false);
        }}
      >
        삭제하기
      </CommentDropBoxOption>
    </CommentDropBoxDiv>
  );
};

export default CommentDropBox;
