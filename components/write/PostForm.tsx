import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  Alert,
  Avatar,
  Button,
  Container,
  IconButton,
  Snackbar,
  Typography,
  TextField,
  Modal,
} from '@mui/material';
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
  getDoc,
  getDocs,
} from 'firebase/firestore';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { db, firebase } from '@firebase/firebase';
import { Box } from '@mui/system';

import Router from 'next/router';
//select 부분을 위해서 사용
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Link from 'next/link';
//photoupload용 아이콘
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';

import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import type { RootReducer } from 'store/reducer';
import { useSelector } from 'react-redux';
import { withRouter } from 'next/router';
import { StoreState, UserState } from '@interface/StoreInterface';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ValidRounge } from '../../interface/StoreInterface';
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
interface postSubTheme {
  title: string;
  url: string;
}
const PostForm = () => {
  //이미지 업로드 부분
  const [modalOpen, setModalOpen] = useState(false);
  const [postImage, setPostImage] = useState<any>(null);
  const [url, setUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [imgList, setImgList] = useState<any>([]);
  //텍스트 처리
  const { user }: UserState = useSelector((state: StoreState) => state.user);

  //유저
  const [uid, setUid] = useState<string>('');
  const [alertType, setAlertType] = useState<
    'error' | 'info' | 'success' | 'warning'
  >('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [clickState, setClickState] = useState(true);
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
    image: [],
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
  //photoupload 확인 아이콘-아직 미구현
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const timer = React.useRef<number>();
  const storage = getStorage();
  // Create the file metadata
  /** @type {any} */
  const metadata = {
    contentType: 'image/jpeg',
  };

  //rounge,topic 바뀔때마다 세부주제value값 menu에 반영
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

  const showAlert = (type: any, msg: any) => {
    setAlertType(type);
    setAlertMessage(msg);
    setOpen(true);
  };
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      setUid(user.uid);
    } else {
      console.log('no user');
      //console.log를 모달창으로 바꿀것
    }
  });

  // useEffect(() => {
  //   const findUserInfo = async () => {
  //     //id로 user 파악함
  //     const docRef = doc(db, 'user', user.id);
  //     const docSnap = await getDoc(docRef);
  //     setuserInfoList(docSnap.data());
  //   };
  //   findUserInfo();
  // }, []);

  const handleClose: any = (event: any, reason: any) => {
    setOpen(!open);
  };

  const onSubmit = async () => {
    //사진 정보 저장
    let image: Array<Object> = [];
    //[이미지 다운로드 url, firebase에 저장한 이미지 이름, 이미지 설명]
    if (imgList.length >= 1) {
      image = imgList.map((v: Array<Object>) => {
        return { url: v[0], imgName: v[1], imgDetail: v[2] };
      });
    } else {
      image = [];
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
        image: image,
        commentsCount: 0,
        urlKey: 'topic',
      };

      const { id: newId } = await addDoc(collectionRef, putObj);
      //새로 생성된 post id를 user 정보에 추가

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
      //유저에 게시물 id 추가
      setModalOpen(true);
      //나중에 topic 페이지로 이동하도록 변경하기
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
        image: image,
        commentsCount: 0,
        urlKey: postRounge.url,
      };

      const { id: newId } = await addDoc(collectionRef, putObj);
      //새로 생성된 post id를 user 정보에 추가

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
      //유저에 게시물 id 추가
      setModalOpen(true);
      //나중에 topic 페이지로 이동하도록 변경하기
    }
    //원하는 타겟으로 나중에 변경하기
  };

  //이미지 업로드
  //수정중, 복원이 어렵다면 notepad에 적어놓은거로 다시 돌려놓을것
  const handleUploadChange = (e: any) => {
    if (e.target.files[0]) {
      setPostImage(e.target.files[0]);
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
          console.log('File available at', downloadURL);
          setUrl(url);
          //[이미지 다운로드 url, firebase에 저장한 이미지 이름, 이미지 설명]
          setImgList([...imgList, [downloadURL, uploadImageName, '']]);
        });
      },
    );
    //postImage가 계속 남아있어 지속적으로 업로드되는 것을 방지함
  };

  function deleteClick(targetPicture: string) {
    const storage = getStorage();

    // Create a reference to the file to delete
    const desertRef = ref(storage, 'images/' + targetPicture);

    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        console.log('사진이 삭제되었습니다.');
        // File deleted successfully
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //업로드 확인 버튼부분 구현
  // const buttonSx = {
  //   ...(success && {
  //     bgcolor: green[500],
  //     '&:hover': {
  //       bgcolor: green[700],
  //     },
  //   }),
  // };

  // useEffect(() => {
  //   return () => {
  //     clearTimeout(timer.current);
  //   };
  // }, []);

  // const handleButtonClick = () => {
  //   if (!loading && progress !== 0 && progress !== 100) {
  //     setSuccess(false);
  //     setLoading(true);
  //   } else if (loading && progress === 100) {
  //     setSuccess(true);
  //     setLoading(false);
  //     timer.current = window.setTimeout(() => {
  //       setSuccess(false);
  //       setLoading(false);
  //     }, 2000);
  //   }
  // };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Box sx={{ minWidth: 120, mt: 6 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">등록위치</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={post.postType}
              label="postMenu"
              onChange={(e) => setPost({ ...post, postType: e.target.value })}
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
              >
                {user.validRounges &&
                  user.validRounges.map((v: any, i: number) => {
                    return (
                      <MenuItem value={v.title} key={v.url}>
                        {v.title}
                      </MenuItem>
                    );
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
                  sx={{ position: 'relative' }}
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
            {/* photoupload아이콘 */}
            {/* 우선 미구현 */}
            {/* <Box sx={{ position: 'relative' }}>
            <Fab aria-label="save" color="primary" sx={buttonSx}>
              {success ? <CheckIcon /> : <SaveIcon />}
            </Fab>
            {loading && (
              <CircularProgress
                size={68}
                sx={{
                  color: green[500],
                  position: 'absolute',
                  top: -6,
                  left: -6,
                  zIndex: -1,
                }}
              />
            )}
          </Box> */}

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
          {/* <Button onClick={handleUpload}>Upload</Button> */}
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
              {post.title}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              게시물을 등록하였습니다
            </Typography>
          </Box>
        </Modal>
      </Container>
    </Layout>
  );
};

export default PostForm;
