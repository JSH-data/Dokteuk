import { setScrollAction } from '@store/reducer';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import moment from 'moment';
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
import { db } from '@firebase/firebase';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAuth } from '@hooks/Auth';
import Comment from '@components/comment/Comment';
import type { RootReducer } from 'store/reducer';
import { useSelector } from 'react-redux';
import CustomSeparator from '@components/post/Separator';
import Moment from 'react-moment';
import 'moment/locale/ko';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { typography } from '@mui/system';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import UpdateLink from '@components/post/UpdateLink';
import DeleteLink from '@components/post/DeleteLink';
import EditPostForm from '@components/write/EditPostForm';
export const getServerSideProps: GetServerSideProps = async (
  // context: GetServerSidePropsContext,
  context: GetServerSidePropsContext,
) => {
  let id;
  if (context.params?.postId) {
    id = context.params.postId;
  } else id = null;
  const docRef = doc(db, 'posts', id as string);
  const docSnap = await getDoc(docRef);
  if (context.req.headers.referer && context.req.url)
    return {
      props: {
        referer: context.req.headers.referer
          .split('/')
          .slice(3, context.req.headers.referer.split('/').length)
          .join('/'),
        postProps: JSON.stringify(docSnap.data()),
        postId: id,
      },
    };
  return {
    props: { postProps: JSON.stringify(docSnap.data()), postId: id },
  };
};

export default function RoungePost({
  referer,
  postProps,
  postId,
}: {
  referer: string | undefined;
  postProps: string;
  postId: string;
}) {
  const { user }: any = useSelector((state: RootReducer) => state.user);
  const [post, setPost] = useState(JSON.parse(postProps));

  //해당 게시물에 좋아요를 누른 사람의 배열과 현재 로그인한 유저의 이메일을 비교하여 판단함
  const [userLike, setUserLike] = useState(post.pressPerson.includes(user.id));
  const [postLikeCount, setPostLikeCount] = useState(post.pressPerson.length);
  const [editOpen, setEditOpen] = useState(false);

  const dispatch = useDispatch();
  const changeLike = async (id: any, e: any) => {
    //다른 태그에 이벤트가 전달되지 않게 하기 위함
    console.log(post);
    e.stopPropagation();
    if (userLike) {
      setUserLike(false);
      setPostLikeCount(postLikeCount - 1);
      const userDocRef = doc(db, 'posts', postId);
      //likeuser에서 현재 유저의 이메일 index를 찾아내서 제거함
      await updateDoc(userDocRef, {
        pressPerson: arrayRemove(user.id),
      });
    } else {
      setUserLike(true);
      setPostLikeCount(postLikeCount + 1);
      const userDocRef = doc(db, 'posts', postId);
      //likeuser에서 현재 유저의 이메일 index를 추가함
      await updateDoc(userDocRef, {
        pressPerson: arrayUnion(user.id),
      });
    }
  };
  const MomentDateChange = () => {
    const nowTime = Date.now(),
      startTime = new Date(post.createdAt.seconds * 1000);

    return <Moment fromNow>{startTime}</Moment>;
  };

  useEffect(() => {
    // search에서의 접속은 referer가 search이다.
    if (
      !(
        (
          referer && // 이전 페이지 정보가 존재할 것
          referer.split('/').length === 2 && // 2인 경우는 list/* 에서 온 경우
          referer.split('/')[0] === 'list'
        ) // [0]가 list인지 확인
      ) &&
      referer !== 'search'
    ) {
      dispatch(setScrollAction(0));
    }
  }, []);

  return (
    <Container maxWidth="sm">
      {editOpen ? (
        <EditPostForm
          setEditOpen={setEditOpen}
          setPost={setPost}
          thisPostId={postId}
          postInfo={post}
        />
      ) : (
        <Box sx={{ minWidth: 120, mt: 6 }}>
          <CustomSeparator menu={post} />
          <Typography
            variant="h5"
            component="div"
            sx={{ mb: 2 }}
            style={{ wordBreak: 'break-all' }}
          >
            {post.title}
          </Typography>
          <Typography
            component="span"
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {userLike ? (
              <FavoriteIcon
                onClick={(e) => changeLike(postId, e)}
                sx={{ mr: 1 }}
              />
            ) : (
              <FavoriteBorderIcon
                onClick={(e) => changeLike(postId, e)}
                sx={{ mr: 1 }}
              />
            )}
            {postLikeCount}
            <AccessTimeIcon sx={{ ml: 3, mr: 1 }} />
            <MomentDateChange />
            {/* <DriveFileRenameOutlineIcon sx={{ ml: 3, mr: 1 }} />
          수정하기 */}
            {post.userId === user.id ? (
              <>
                <UpdateLink
                  thisUser={user.id}
                  thisPost={postId}
                  setEditOpen={setEditOpen}
                />
                <DeleteLink
                  thisUser={user.id}
                  thisPost={postId}
                  thisPostTitle={post.title}
                />
              </>
            ) : (
              ''
            )}
          </Typography>
          <Divider sx={{ mt: 1, mb: 2 }} />
          <Typography
            sx={{ mb: 2 }}
            style={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}
          >
            {/* <div style={{ whiteSpace: 'pre-line' }}>{post.content}</div> */}
            {post.content}
          </Typography>
          <Box
            sx={{
              mt: 3,
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {post.image &&
              Object.entries(post.image).length !== 0 &&
              Object.entries(post.image).map((v: Array<any>, i: number) => {
                return (
                  <Box
                    key={v[1][0]}
                    sx={{
                      mt: 3,
                      justifyContent: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <img key={i} src={v[1][0]} alt={v[1][0]} />
                    <Typography sx={{ mb: 2, mt: 1 }}>{v[1][2]}</Typography>
                  </Box>
                );
              })}
          </Box>
          <CardActions>
            <Link href="/" passHref>
              <Button size="small">뒤로가기</Button>
            </Link>
          </CardActions>
        </Box>
      )}
    </Container>
  );
}
