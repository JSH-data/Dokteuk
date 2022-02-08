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
  id: string;
};

const LikeComponent: React.FC<LikeProps> = ({ likes, isClicked, id }) => {
  const addLike = async () => {
    const commentRef = doc(db, 'comment', id);
    if (isClicked) {
      await updateDoc(commentRef, {
        pressed_person: arrayRemove('user'),
        likes: likes - 1,
      });
    } else {
      await updateDoc(commentRef, {
        pressed_person: arrayUnion('user'),
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

      <span>{likes}</span>
    </LikeDiv>
  );
};

export default LikeComponent;
