import {
  likeViewPostAction,
  setScrollAction,
  unLikeViewPostAction,
} from '@store/reducer';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useDispatch } from 'react-redux';
import { Box, Container, Divider, Typography } from '@mui/material';

import {
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

import React, { useEffect, useState } from 'react';
import { db } from '@firebase/firebase';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

import Comment from '@components/comment/Comment';
import type { RootReducer } from 'store/reducer';
import { useSelector } from 'react-redux';
import CustomSeparator from '@components/post/Separator';
import Moment from 'react-moment';
import 'moment/locale/ko';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import UpdateLink from '@components/post/UpdateLink';
import DeleteLink from '@components/post/DeleteLink';
import EditPostForm from '@components/write/EditPostForm';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Layout from '@layouts/Layout';
import { StoreState, UserState } from '@interface/StoreInterface';
import AuthorClickMenu from '@components/items/AuthorClickMenu';
import { ChatDefault, createChatRoom } from '@utils/createChatRoom';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';

const DividerStyled = styled(Divider)`
  margin: 0;
  flex-shrink: 0;
  border-width: 0;
  border-style: solid;
  border-color: ${({ theme }: any) => theme.lightGray};
  border-bottom-width: thin;
  margin-top: 8px;
  margin-bottom: 16px;

  @media (prefers-color-scheme: dark) {
    border-color: ${({ theme }: any) => theme.darkGray};
  }
`;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  let id;

  if (context.params?.postId) {
    id = context.params.postId;
  } else id = null;
  const docRef = doc(db, 'post', id as string);

  const docSnap = await getDoc(docRef);

  if (JSON.stringify(docSnap.data()) === undefined) {
    return {
      notFound: true,
      props: {},
    };
  } else {
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
  }
};

export default function TopicPost({
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
  const [uid, setUid] = useState<string>('');
  const [updateTime, setUpdateTime] = useState(0);
  //해당 게시물에 좋아요를 누른 사람의 배열과 현재 로그인한 유저의 이메일을 비교하여 판단함
  const [userLike, setUserLike] = useState(post.pressPerson.includes(uid));
  const [postLikeCount, setPostLikeCount] = useState(post.pressPerson.length);
  const [editOpen, setEditOpen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const dispatch = useDispatch();

  // 파이어스토어 업데이트, 클라이언트 상태 업데이트
  const { user: myInfo }: UserState = useSelector(
    (state: StoreState) => state.user,
  );
  const [isLiked, setIsLiked] = useState(
    post.pressPerson.indexOf(myInfo.id) !== -1,
  );
  const onLike = async () => {
    const postDocRef = doc(db, 'post', post.postId);
    const { pressPerson } = post;
    const newPressPerson = Array.from(new Set([...pressPerson, uid]));
    await updateDoc(postDocRef, { pressPerson: newPressPerson });
    dispatch(likeViewPostAction({ postId: post.postId, userId: uid }));
    setPostLikeCount(newPressPerson.length);
    setIsLiked(true);
  };
  const onUnLike = async () => {
    const postDocRef = doc(db, 'post', post.postId);
    const { pressPerson } = post;
    const newPressPerson = pressPerson.filter((id: string) => id !== uid);
    await updateDoc(postDocRef, { pressPerson: newPressPerson });
    dispatch(unLikeViewPostAction({ postId: post.postId, userId: uid }));
    setPostLikeCount(newPressPerson.length);
    setIsLiked(false);
  };
  //

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
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUid(user.uid);
    }
  });

  const MomentDateChange = () => {
    const nowTime = Date.now(),
      startTime =
        post.updatedAt === ''
          ? new Date(post.createdAt.seconds * 1000)
          : updateTime !== 0
          ? new Date(updateTime)
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
  //채팅방 열기
  const router = useRouter();
  const onToggle = () => {
    setToggle(false);
  };
  const openChat = async () => {
    const myInfo: ChatDefault = {
      nickname: user.nickname,
      jobSector: user.jobSector,
      id: uid,
    };
    const counterInfo: ChatDefault = {
      nickname: post.nickname,
      jobSector: post.job,
      id: post.userId,
    };
    const id = await createChatRoom(myInfo, counterInfo);
    router.push(
      `/chat/${id}?other=${counterInfo.nickname}&id=${counterInfo.id}`,
    );
  };
  return (
    <Layout>
      <Container sx={{ maxWidth: '680px' }}>
        {editOpen ? (
          <EditPostForm
            setEditOpen={setEditOpen}
            setPost={setPost}
            thisPostId={postId}
            postInfo={post}
            setUpdateTime={setUpdateTime}
          />
        ) : (
          <Box sx={{ minWidth: 120, mt: 6 }}>
            <CustomSeparator menu={post} />
            <Typography
              variant="h4"
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
              {uid !== post.userId ? (
                <Typography
                  component="span"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setToggle(true);
                  }}
                >
                  {post.nickname} ({post.job})
                </Typography>
              ) : (
                <Typography component="span">
                  {post.nickname} ({post.job})
                </Typography>
              )}
            </Typography>
            <Typography
              component="span"
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              {isLiked ? (
                <FavoriteIcon
                  onClick={async () => {
                    await onUnLike();
                  }}
                  style={{ cursor: 'pointer' }}
                  sx={{ mr: 1 }}
                />
              ) : (
                <FavoriteBorderIcon
                  onClick={async () => {
                    await onLike();
                  }}
                  style={{ cursor: 'pointer' }}
                  sx={{ mr: 1 }}
                />
              )}

              {postLikeCount}
              <AccessTimeIcon sx={{ ml: 3, mr: 1 }} />
              <MomentDateChange />
              {post.updatedAt === '' ? '' : '(수정됨)'}

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
            <DividerStyled />
            <Typography
              sx={{ mb: 2 }}
              style={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}
            >
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
              {post.images.length !== 0 &&
                post.images.map((v: any, i: number) => {
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
        )}
      </Container>
      {editOpen ? (
        ''
      ) : (
        <Container sx={{ maxWidth: '680px' }}>
          <Comment
            postData={{
              id: post.postId,
              ownerId: post.userId,
              type: post.postType,
              title: post.title,
            }}
          />
        </Container>
      )}
      {toggle && <AuthorClickMenu onToggle={onToggle} openChat={openChat} />}
    </Layout>
  );
}
