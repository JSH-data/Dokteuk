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
  Modal,
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
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Router from 'next/router';
import Layout from '@layouts/Layout';
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '4px 4px 4px 4px',
  boxShadow: 24,
  p: 4,
};
export const getServerSideProps: GetServerSideProps = async (
  // context: GetServerSidePropsContext,
  context: GetServerSidePropsContext,
) => {
  let id;
  if (context.params?.postId) {
    id = context.params.postId;
  } else id = null;
  const docRef = doc(db, 'post', id as string);
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
  const { user } = useSelector((state: RootReducer) => state.user);
  // const [user, setUser] = useState<any>({});
  const [post, setPost] = useState(JSON.parse(postProps));
  const [uid, setUid] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [notRoungemodalOpen, setNotRoungemodalOpen] = useState(false);
  //해당 게시물에 좋아요를 누른 사람의 배열과 현재 로그인한 유저의 이메일을 비교하여 판단함
  const [userLike, setUserLike] = useState(post.pressPerson.includes(uid));
  const [postLikeCount, setPostLikeCount] = useState(post.pressPerson.length);
  const [editOpen, setEditOpen] = useState(false);
  const [accessPost, setAccessPost] = useState('');
  const dispatch = useDispatch();
  // useEffect(() => {
  // const getUser = async () => {
  //   if (uid !== '') {
  //     const docRef = doc(db, 'user', uid);
  //     const docSnap = await getDoc(docRef);
  //     setUser(docSnap.data());
  //   }
  // };
  // getUser();
  // }, [uid]);

  const changeLike = async (id: any, e: any) => {
    //다른 태그에 이벤트가 전달되지 않게 하기 위함

    e.stopPropagation();
    if (userLike) {
      setUserLike(false);
      setPostLikeCount(postLikeCount - 1);
      const userDocRef = doc(db, 'post', postId);
      //likeuser에서 현재 유저의 이메일 index를 찾아내서 제거함
      await updateDoc(userDocRef, {
        pressPerson: arrayRemove(uid),
      });
    } else {
      setUserLike(true);
      setPostLikeCount(postLikeCount + 1);
      const userDocRef = doc(db, 'post', postId);
      //likeuser에서 현재 유저의 이메일 index를 추가함
      await updateDoc(userDocRef, {
        pressPerson: arrayUnion(uid),
      });
    }
  };
  const auth = getAuth();
  onAuthStateChanged(auth, (loginUser) => {
    if (loginUser) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      setUid(loginUser.uid);
    } else {
      setAccessPost('noUser');
      setModalOpen(true);
      //console.log를 모달창으로 바꿀것
    }
  });
  const MomentDateChange = () => {
    const nowTime = Date.now(),
      startTime =
        post.updatedAt === ''
          ? new Date(post.createdAt.seconds * 1000)
          : new Date(post.updatedAt.seconds * 1000);
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

  useEffect(() => {
    if (user.validRounges.map((v: any) => v.url).includes(post.rounge.url)) {
      setAccessPost('accessAvailable');
    } else {
      setAccessPost('noAuthority');
      setNotRoungemodalOpen(true);
    }
  }, []);

  return (
    <Layout>
      <Container maxWidth="sm">
        {accessPost === '' ? (
          <Box sx={{ mt: 6 }}>
            <Stack spacing={2}>
              <Skeleton variant="rectangular" width="sm" height={58} />
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width="sm" />
              <Skeleton variant="rectangular" width="sm" height={118} />
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width="sm" />
              <Skeleton variant="rectangular" width="sm" height={118} />
            </Stack>
          </Box>
        ) : accessPost === 'noUser' ? (
          <>
            <Box sx={{ mt: 6 }}>
              <Stack spacing={2}>
                <Skeleton variant="rectangular" width="sm" height={58} />
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width="sm" />
                <Skeleton variant="rectangular" width="sm" height={118} />
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width="sm" />
                <Skeleton variant="rectangular" width="sm" height={118} />
              </Stack>
            </Box>
            <Modal
              open={modalOpen}
              onClose={() => {
                Router.push('/user/login');
              }}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  style={{ wordBreak: 'break-word' }}
                >
                  로그인 후 이용해주세요
                </Typography>
              </Box>
            </Modal>
          </>
        ) : accessPost === 'noAuthority' ? (
          <>
            <Box sx={{ mt: 6 }}>
              <Stack spacing={2}>
                <Skeleton variant="rectangular" width="sm" height={58} />
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width="sm" />
                <Skeleton variant="rectangular" width="sm" height={118} />
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width="sm" />
                <Skeleton variant="rectangular" width="sm" height={118} />
              </Stack>
            </Box>
            <Modal
              open={notRoungemodalOpen}
              onClose={() => {
                Router.push('/');
              }}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  style={{ wordBreak: 'break-word' }}
                >
                  해당 게시물의 라운지에 속해 있지 않아 게시물을 볼 수 없습니다
                </Typography>
              </Box>
            </Modal>
          </>
        ) : (
          ''
        )}
        {accessPost === 'accessAvailable' &&
          (editOpen ? (
            <EditPostForm
              setEditOpen={setEditOpen}
              setPost={setPost}
              thisPostId={postId}
              postInfo={post}
            />
          ) : (
            accessPost === 'accessAvailable' && (
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
                  component="div"
                  sx={{ mb: 2 }}
                  style={{ wordBreak: 'break-all' }}
                >
                  {post.nickname} ({post.job})
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
                  {post.updatedAt === '' ? '' : '(수정됨)'}
                  {/* <DriveFileRenameOutlineIcon sx={{ ml: 3, mr: 1 }} />
          수정하기 */}
                  {post.userId === uid ? (
                    <>
                      <UpdateLink
                        thisUser={uid}
                        thisPost={postId}
                        setEditOpen={setEditOpen}
                      />
                      <DeleteLink
                        thisUser={uid}
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
                  {post.image.length !== 0 &&
                    post.image.map((v: any, i: number) => {
                      return (
                        <Box
                          key={v.url}
                          sx={{
                            mt: 3,
                            justifyContent: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                        >
                          <img src={v.url} style={{ maxWidth: '100%' }} />
                          <Typography
                            sx={{ mb: 2, mt: 1 }}
                            style={{
                              whiteSpace: 'pre-line',
                              wordBreak: 'break-all',
                            }}
                          >
                            {v.imgDetail}
                          </Typography>
                        </Box>
                      );
                    })}
                </Box>
              </Box>
            )
          ))}
      </Container>
    </Layout>
  );
}
