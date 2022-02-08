import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import {
  collection,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  onSnapshot,
  getDocsFromServer,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { db } from '../../firebase';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAuth } from '../../Auth';

const Detail = ({ postProps, postId }) => {
  const post = JSON.parse(postProps);
  const { currentUser } = useAuth();
  //해당 게시물에 좋아요를 누른 사람의 배열과 현재 로그인한 유저의 이메일을 비교하여 판단함
  const [userLike, setUserLike] = useState(
    post.press_person.includes(currentUser.uid),
  );
  const [postLikeCount, setPostLikeCount] = useState(post.press_person.length);

  const changeLike = async (id, e) => {
    //다른 태그에 이벤트가 전달되지 않게 하기 위함

    e.stopPropagation();
    if (userLike) {
      setUserLike(false);
      setPostLikeCount(postLikeCount - 1);
      const userDocRef = doc(db, 'posts', postId);
      //likeuser에서 현재 유저의 이메일 index를 찾아내서 제거함
      await updateDoc(userDocRef, {
        press_person: arrayRemove(currentUser.uid),
      });
    } else {
      setUserLike(true);
      setPostLikeCount(postLikeCount + 1);
      const userDocRef = doc(db, 'posts', postId);
      //likeuser에서 현재 유저의 이메일 index를 추가함
      await updateDoc(userDocRef, {
        press_person: arrayUnion(currentUser.uid),
      });
    }
  };

  return (
    <>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item xs={3}>
          <Card
            sx={{ minWidth: 274, maxWidth: 500, boxShadow: 3 }}
            style={{ backgroundColor: '#fafafa' }}
          >
            <CardContent>
              {userLike ? (
                <FavoriteIcon onClick={(e) => changeLike(postId, e)} />
              ) : (
                <FavoriteBorderIcon onClick={(e) => changeLike(postId, e)} />
              )}
              {postLikeCount}
              <Typography variant="h5" component="div">
                {post.title}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {post.content}
              </Typography>
            </CardContent>
            <CardActions>
              <Link href="/">
                <Button size="small">back to home</Button>
              </Link>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Detail;

export const getStaticPaths = async () => {
  const snapshot = await getDocs(collection(db, 'posts'));
  const paths = snapshot.docs.map((doc) => {
    return {
      params: { id: doc.id.toString() },
    };
  });
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const id = context.params.id;

  const docRef = doc(db, 'posts', id);

  const docSnap = await getDoc(docRef);

  return {
    props: { postProps: JSON.stringify(docSnap.data()), postId: id || null },
  };
};
