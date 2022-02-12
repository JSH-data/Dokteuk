import React from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@firebase/firebase';
import styled from '@emotion/styled';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const LikeDiv = styled.div`
  margin-bottom: 15px;
  font-size: 1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
`;

type LikeProps = {
  likes: number;
  isClicked: boolean;
  commentId: string;
  isDeleted: boolean;
  userId: string;
};
// todo: 비로그인 사용자 좋아요 방지
const LikeComponent: React.FC<LikeProps> = ({
  likes,
  isClicked,
  commentId,
  isDeleted,
  userId,
}) => {
  const addLike = async () => {
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }
    const commentRef = doc(db, 'comment', commentId);
    if (isClicked) {
      await updateDoc(commentRef, {
        pressedPerson: arrayRemove(userId),
        likes: likes - 1,
      });
    } else {
      await updateDoc(commentRef, {
        pressedPerson: arrayUnion(userId),
        likes: likes + 1,
      });
    }
  };

  return (
    <LikeDiv>
      {isClicked ? (
        <FavoriteIcon onClick={() => addLike()} />
      ) : (
        <FavoriteBorderIcon onClick={() => addLike()} />
      )}
      {!isDeleted && <span>{likes}</span>}
    </LikeDiv>
  );
};

export default LikeComponent;
