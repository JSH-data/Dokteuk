import React, { useState, useEffect } from 'react';
import {
  Alert,
  Button,
  Container,
  Snackbar,
  Typography,
  TextField,
  Modal,
} from '@mui/material';
import styled from '@emotion/styled';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
} from 'firebase/firestore';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { db } from '@firebase/firebase';
import { Box } from '@mui/material';

import Router from 'next/router';
//select 부분을 위해서 사용
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Link from 'next/link';
//photoupload용 아이콘

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import { resetViewAction } from '@store/reducer';
import { useDispatch, useSelector } from 'react-redux';

import { StoreState, UserState } from '@interface/StoreInterface';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import Layout from '@layouts/Layout';

const ContainerStyled = styled(Container)`
  & .MuiButton-root {
    background: ${({ theme }: any) => theme.mainColorViolet};
    :hover {
      opacity: 0.8;
      background: ${({ theme }: any) => theme.mainColorViolet};
    }
  }
  & .MuiOutlinedInput-input {
    color: black;
  }
  & label {
    color: ${({ theme }: any) => theme.darkGray};
  }
  & .MuiOutlinedInput-notchedOutline {
    border: 1px solid ${({ theme }: any) => theme.darkGray};
  }
  & .MuiButton-root.MuiButton-text {
    color: red;
    background: none;
  }

  @media (prefers-color-scheme: dark) {
    & .MuiOutlinedInput-input {
      color: white;
    }
    & label {
      color: ${({ theme }: any) => theme.lightGray};
    }
    & .MuiInput-root {
      color: white;
      border-bottom: 1px solid ${({ theme }: any) => theme.darkGray};
    }
    & .MuiOutlinedInput-notchedOutline {
      border: 1px solid ${({ theme }: any) => theme.darkGray};
    }
    & .MuiSvgIcon-root {
      color: ${({ theme }: any) => theme.lightGray};
    }
    & .MuiButton-root {
      MuiSkeleton-root :hover {
        opacity: 0.8;
        background: ${({ theme }: any) => theme.mainColorBlue};
      }
    }
    & .MuiSkeleton-root {
      background: ${({ theme }: any) => theme.darkGray};
    }
  }
`;

const BoxStyled = styled(Box)`
  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }: any) => theme.blackGray};
  }
`;
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

const PostForm = ({ from }: { from: string }) => {
  const dispatch = useDispatch();

  //이미지 업로드 부분
  const [modalOpen, setModalOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [imgList, setImgList] = useState<any>([]);

  const [postedUrl, setPostedUrl] = useState<string>('');

  const { user }: UserState = useSelector((state: StoreState) => state.user);

  const [uid, setUid] = useState<string>('');
  const [alertType, setAlertType] = useState<
    'error' | 'info' | 'success' | 'warning'
  >('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState({
    title: '',
    content: '',
    pressPerson: [],
    postId: '',
    postType: '',
    userId: '',
    createdAt: '',
    updatedAt: '',
    job: '',
    nickname: '',
    images: [],
    commentsCount: 0,
  });
  const [postTopic, setPostTopic] = useState<any>({
    title: '',
    url: '',
  });
  const [postRounge, setPostRounge] = useState<any>({
    title: '',
    url: '',
  });
  //memuselector
  const [topicMenu, setTopicMenu] = useState<any>('');
  const [roungeMenu, setRoungeMenu] = useState<any>('');

  const storage = getStorage();
  // Create the file metadata
  /** @type {any} */
  const metadata = {
    contentType: 'images/jpeg',
  };

  useEffect(() => {
    if (post.postType === 'topic') {
      const topicArr = [
        { title: '연말정산', url: 'hometax' },
        { title: '여행', url: 'travel' },
        { title: '블라블라', url: 'blabla' },
        { title: '주식투자', url: 'stock' },
      ];
      for (let i = 0; i < 4; i++) {
        if (topicArr[i].title === topicMenu) {
          setPostTopic(topicArr[i]);
        }
      }
    } else if (post.postType === 'rounge') {
      for (let i = 0; i < user.validRounges.length; i++) {
        if (user.validRounges[i].title === roungeMenu) {
          setPostRounge(user.validRounges[i]);
        }
      }
    }
  }, [topicMenu, roungeMenu]);

  const showAlert = (
    type: 'error' | 'info' | 'success' | 'warning',
    msg: string,
  ) => {
    setAlertType(type);
    setAlertMessage(msg);
    setOpen(true);
  };
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUid(user.uid);
    } else {
      setUid('noUser');
    }
  });

  const handleClose = () => {
    setOpen(!open);
  };

  const onSubmit = async () => {
    let images: Array<Object> = [];
    //[이미지 다운로드 url, firebase에 저장한 이미지 이름, 이미지 설명]
    if (imgList.length >= 1) {
      images = imgList.map((v: Array<Object>) => {
        return { url: v[0], imgName: v[1], imgDetail: v[2] };
      });
    } else {
      images = [];
    }

    if (post.postType === '' || post.title === '' || post.content === '') {
      showAlert('error', `필수항목을 작성해 주세요`);
    } else if (
      post.postType === 'topic' &&
      postTopic === { title: '', url: '' }
    ) {
      showAlert('error', `토픽 주제를 선택해 주세요`);
    } else if (
      post.postType === 'rounge' &&
      postRounge === { title: '', url: '' }
    ) {
      showAlert('error', `라운지 분류를 선택해 주세요`);
    } else if (post.postType === 'topic') {
      const collectionRef = collection(db, 'post');
      const putObj = {
        title: post.title,
        content: post.content,
        pressPerson: [],
        postId: '',
        postType: 'topic',
        topic: postTopic,
        updatedAt: '',
        userId: uid,
        job: user.jobSector,
        nickname: user.nickname,
        createdAt: serverTimestamp(),
        images,
        commentsCount: 0,
        urlKey: 'topic',
      };

      const { id: newId } = await addDoc(collectionRef, putObj);
      //새로 생성된 post id를 user 정보에 추가

      setPostedUrl(`/list/topic/${postTopic.url}/${newId}`);
      //
      const docRef = doc(db, 'user', uid);
      const userPostUpdate = {
        ...user,
        post: [...user.posts, newId],
      };
      updateDoc(docRef, userPostUpdate);
      //새로 생성된 post id를 post 정보에 추가
      const docPostRef = doc(db, 'post', newId);
      const PostUpdate = {
        ...putObj,
        postId: newId,
      };
      updateDoc(docPostRef, PostUpdate);

      setModalOpen(true);

      if (from === 'topic' || from === 'timeline' || !from) {
        // [rounge] 페이지가 아닌 페이지에서 write로 접근 후 topic 글 작성
        dispatch(resetViewAction()); // 서버상태와 동기화를 위해 초기화
      }
    } else {
      const collectionRef = collection(db, 'post');
      const putObj = {
        title: post.title,
        content: post.content,
        pressPerson: [],
        postId: '',
        postType: 'rounge',
        rounge: postRounge,
        updatedAt: '',
        userId: uid,
        job: user.jobSector,
        nickname: user.nickname,
        createdAt: serverTimestamp(),
        images,
        commentsCount: 0,
        urlKey: postRounge.url,
      };

      const { id: newId } = await addDoc(collectionRef, putObj);

      const docRef = doc(db, 'user', uid);
      const userPostUpdate = {
        ...user,
        post: [...user.posts, newId],
      };
      updateDoc(docRef, userPostUpdate);

      const docPostRef = doc(db, 'post', newId);
      const PostUpdate = {
        ...putObj,
        postId: newId,
      };
      updateDoc(docPostRef, PostUpdate);

      setModalOpen(true);

      setPostedUrl(`/list/rounge/${postRounge.url}/${newId}`);
    }

    if (from === 'timeline' || from === postRounge) {
      // 이전 [rounge] 페이지에서 현재 [rounge] 페이지 글 작성 또는 이전 페이지가 timeline
      dispatch(resetViewAction()); // 서버상태와 동기화를 위해 초기화
    }
  };

  const handleUploadChange = (e: any) => {
    if (e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = (postImage: any) => {
    const uploadImageName = postImage.name + String(Date.now());
    const storageRef = ref(storage, 'images/' + uploadImageName);
    const uploadTask = uploadBytesResumable(storageRef, postImage, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot: any) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        setProgress(progress);
      },
      (error: any) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUrl(url);
          setImgList([...imgList, [downloadURL, uploadImageName, '']]);
        });
      },
    );
  };

  function deleteClick(targetPicture: string) {
    const storage = getStorage();

    const desertRef = ref(storage, 'images/' + targetPicture);

    deleteObject(desertRef)
      .then(() => {
        showAlert('info', `사진이 삭제되었습니다`);
      })
      .catch((error) => {
        showAlert(
          'error',
          `사진 삭제 중 오류가 발생했습니다 다시 시도해 주세요`,
        );
      });
  }

  return (
    <Layout>
      {uid === 'noUser' ? (
        <ContainerStyled maxWidth="sm">
          <Box sx={{ minWidth: 120, mt: 6 }}>
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
              open={true}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <BoxStyled sx={style}>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  style={{ wordBreak: 'break-word' }}
                >
                  로그인 후 이용해주세요
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    sx={{ mt: 2 }}
                    onClick={() => {
                      Router.push('/user/login');
                    }}
                  >
                    확인
                  </Button>
                </Box>
              </BoxStyled>
            </Modal>
          </Box>
        </ContainerStyled>
      ) : (
        <ContainerStyled maxWidth="sm">
          <Box sx={{ minWidth: 120, mt: 6 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">등록위치</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={post.postType}
                label="postMenu"
                onChange={(e) => setPost({ ...post, postType: e.target.value })}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: 'white',
                      '@media (prefers-color-scheme: dark)': {
                        bgcolor: 'rgb(59, 59, 59)',
                        color: 'white',
                        '& .MuiMenuItem-root': {
                          padding: 2,
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value={'rounge'}>라운지</MenuItem>
                <MenuItem value={'topic'}>토픽</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {post.postType === 'topic' && (
            <Box sx={{ minWidth: 120, mt: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">토픽</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={topicMenu}
                  label="postMenu"
                  onChange={(e) => setTopicMenu(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: 'white',
                        '@media (prefers-color-scheme: dark)': {
                          bgcolor: 'rgb(59, 59, 59)',
                          color: 'white',
                          '& .MuiMenuItem-root': {
                            padding: 2,
                          },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value={'연말정산'}>연말정산</MenuItem>
                  <MenuItem value={'여행'}>여행</MenuItem>
                  <MenuItem value={'블라블라'}>블라블라</MenuItem>
                  <MenuItem value={'주식투자'}>주식투자</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
          {post.postType === 'rounge' && (
            <Box sx={{ minWidth: 120, mt: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">라운지</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={roungeMenu}
                  label="RoungeMenu"
                  onChange={(e) => setRoungeMenu(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: 'white',
                        '@media (prefers-color-scheme: dark)': {
                          bgcolor: 'rgb(59, 59, 59)',
                          color: 'white',
                          '& .MuiMenuItem-root': {
                            padding: 2,
                          },
                        },
                      },
                    },
                  }}
                >
                  {user.validRounges &&
                    user.validRounges.map((v: any, i: number) => {
                      if (v.title === '타임라인' || v.title === '토픽') {
                        return '';
                      } else {
                        return (
                          <MenuItem value={v.title} key={v.url}>
                            {v.title}
                          </MenuItem>
                        );
                      }
                    })}
                </Select>
              </FormControl>
            </Box>
          )}
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={open}
            autoHideDuration={6000}
          >
            <Alert
              onClose={handleClose}
              severity={alertType}
              sx={{ width: '100%' }}
            >
              {alertMessage}
            </Alert>
          </Snackbar>
          <div>
            <TextField
              fullWidth
              variant="standard"
              label="제목을 입력해주세요"
              multiline
              sx={{ mt: 2 }}
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
            />
            <TextField
              sx={{ mt: 2 }}
              fullWidth
              variant="standard"
              label="내용을 입력해주세요"
              multiline
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
            />
          </div>
          <Box sx={{ mt: 2 }}></Box>
          {imgList &&
            imgList.map((v: any, i: number) => {
              return (
                <Box
                  key={i}
                  sx={{
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <img src={v[0]} style={{ maxWidth: '100%' }} alt={v[0]} />
                  <Button
                    sx={{
                      position: 'relative',
                      color: 'red',
                    }}
                    onClick={() => {
                      deleteClick(imgList[i][1]);
                      let delArr = [...imgList];
                      delArr.splice(i, 1);
                      setImgList(delArr);
                    }}
                  >
                    삭제하기
                  </Button>
                  <TextField
                    sx={{ mt: 2 }}
                    fullWidth
                    variant="standard"
                    label="사진에 대한 설명을 입력해주세요(선택)"
                    multiline
                    onChange={(e) => {
                      let ImgArr = [...imgList];
                      ImgArr[i][2] = e.target.value;
                      setImgList(ImgArr);
                    }}
                  />
                </Box>
              );
            })}

          <div>
            <label
              htmlFor="ex_file"
              style={{
                display: 'inline-block',
                fontSize: 'inherit',
                lineHeight: 'normal',
                verticalAlign: 'middle',
                cursor: 'pointer',
              }}
            >
              <AddAPhotoIcon sx={{ mt: 4, fontSize: 40 }} />
              <br />

              {progress === 100 ? (
                <div>업로드 완료</div>
              ) : progress === 0 ? (
                ''
              ) : (
                <div>{progress}% 업로드중...</div>
              )}

              <progress value={progress} max="100" />
            </label>
            <input
              type="file"
              id="ex_file"
              style={{
                position: 'absolute',
                width: '0',
                height: '0',
                padding: '0',
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                border: '0',
              }}
              onChange={handleUploadChange}
            />
            <br />
            {url}
            <br />
          </div>

          <Box
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'space-between',
              borderRadius: 1,
            }}
          >
            <Link href="/" passHref>
              <Button variant="contained">메인으로 이동</Button>
            </Link>
            <Button variant="contained" onClick={onSubmit}>
              게시물 작성
            </Button>
          </Box>
          <Box
            sx={{
              mt: 10,
              display: 'flex',
              justifyContent: 'space-between',
              borderRadius: 1,
            }}
          >
            <Typography></Typography>
          </Box>

          <Modal
            open={modalOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <BoxStyled sx={style}>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                style={{ wordBreak: 'break-word' }}
              >
                {post.title}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                게시물을 등록하였습니다
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  sx={{ mt: 2 }}
                  onClick={() => {
                    Router.replace(postedUrl);
                  }}
                >
                  확인
                </Button>
              </Box>
            </BoxStyled>
          </Modal>
        </ContainerStyled>
      )}
    </Layout>
  );
};

export default PostForm;
