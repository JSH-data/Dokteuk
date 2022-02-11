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
} from 'firebase/firestore';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { db } from '@firebase/firebase';
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

const PostForm = () => {
  //이미지 업로드 부분
  const [postImage, setPostImage] = useState<any>(null);
  const [url, setUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [imgList, setImgList] = useState<any>([]);
  //텍스트 처리
  const { user }: any = useSelector((state: RootReducer) => state.user);
  console.log(user);
  //유저
  const [userInfoList, setuserInfoList] = useState<any>('');
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [clickState, setClickState] = useState(true);
  const [post, setPost] = useState({
    title: '',
    content: '',
    press_person: [],
    post_id: '',
    post_type: '',
    user_id: '',
    topic: '',
    rounge: '',
    created_at: '',
    updated_at: '',
    deleted_at: '',
    is_deleted: false,
    job: '',
    nickname: '',
  });
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
  const showAlert = (type: any, msg: any) => {
    setAlertType(type);
    setAlertMessage(msg);
    setOpen(true);
  };
  useEffect(() => {
    const findUserInfo = async () => {
      //id로 user 파악함
      const docRef = doc(db, 'users', user.id);

      const docSnap = await getDoc(docRef);

      setuserInfoList(docSnap.data());
    };
    findUserInfo();
  }, []);

  const handleClose: any = (event: any, reason: any) => {
    setOpen(!open);
  };

  const onSubmit = async () => {
    //post 업데이트 시(아직 미구현)
    // if (post?.hasOwnProperty("timestamp")) {

    //   const docRef = doc(db, "posts", post.id);
    //   const postUpdated = { ...post, timestamp: serverTimestamp() };
    //   updateDoc(docRef, postUpdated);
    //   setPost({ title: "", detail: "" });
    //   showAlert("success", `Post with id ${docRef.id} is updated successfully`);
    // } else { }
    //사진 정보 저장
    let image: any = {};

    if (imgList.length >= 1) {
      // imgURL = [
      //   imgList.map((v: any) => {
      //     return v[0];
      //   }),
      // ];
      // imgDetail = [
      //   imgList.map((v: any) => {
      //     return v[2];
      //   }),
      // ];
      for (let i = 0; i < imgList.length; i++) {
        image[i] = imgList[i];
      }
    } else {
      image = {};
    }
    if (post.post_type === '' || post.title === '' || post.content === '') {
      showAlert('error', `필수항목을 작성해 주세요`);
    } else if (post.post_type === 'Topic' && post.topic === '') {
      showAlert('error', `토픽 주제를 선택해 주세요`);
    } else if (post.post_type === 'Topic') {
      const collectionRef = collection(db, 'posts');
      const { id: newId } = await addDoc(collectionRef, {
        ...post,
        user_id: userInfoList.user_id,
        job: userInfoList.job,
        nickname: userInfoList.nickname,
        rounge: '',
        created_at: serverTimestamp(),
        image: image,
      });
      const docRef = doc(db, 'users', user.id);
      const userPostUpdate = {
        ...userInfoList,
        post: [...userInfoList.post, newId],
      };
      updateDoc(docRef, userPostUpdate);
      //유저에 게시물 id 추가

      //나중에 topic 페이지로 이동하도록 변경하기
      Router.push('/');
    } else {
      const collectionRef = collection(db, 'posts');
      const { id: newId } = await addDoc(collectionRef, {
        ...post,
        user_id: userInfoList.user_id,
        job: userInfoList.job,
        nickname: userInfoList.nickname,
        topic: '',
        created_at: serverTimestamp(),
        image: image,
      });
      const docRef = doc(db, 'users', user.id);
      const userPostUpdate = {
        ...userInfoList,
        post: [...userInfoList.post, newId],
      };
      updateDoc(docRef, userPostUpdate);
      //나중에 topic 페이지로 이동하도록 변경하기
      Router.push('/');
    }
    //원하는 타겟으로 나중에 변경하기
  };
  // useEffect(() => {
  //   const checkIfClickedOutside = (e) => {
  //     if (!inputAreaRef.current.contains(e.target)) {
  //       console.log("Outside input area");
  //       setPost({ title: "", detail: "" });
  //     } else {
  //       console.log("Inside input area");
  //     }
  //   };
  //   document.addEventListener("mousedown", checkIfClickedOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", checkIfClickedOutside);
  //   };
  // }, []);

  //이미지 업로드
  //수정중, 복원이 어렵다면 notepad에 적어놓은거로 다시 돌려놓을것
  const handleUploadChange = (e: any) => {
    if (e.target.files[0]) {
      setPostImage(e.target.files[0]);
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = (postImage: any) => {
    const storageRef = ref(storage, 'images/' + postImage.name);
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
          setImgList([...imgList, [downloadURL, postImage.name, '']]);
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
    <Container maxWidth="sm">
      <Box sx={{ minWidth: 120, mt: 6 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">등록위치</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={post.post_type}
            label="postMenu"
            onChange={(e) => setPost({ ...post, post_type: e.target.value })}
          >
            <MenuItem value={'Rounge'}>라운지</MenuItem>
            <MenuItem value={'Topic'}>토픽</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {post.post_type === 'Topic' && (
        <Box sx={{ minWidth: 120, mt: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">토픽</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={post.topic}
              label="postMenu"
              onChange={(e) => setPost({ ...post, topic: e.target.value })}
            >
              <MenuItem value={'yunmal'}>연말정산</MenuItem>
              <MenuItem value={'market'}>자유시장</MenuItem>
              <MenuItem value={'blabla'}>블라블라</MenuItem>
              <MenuItem value={'stock'}>주식투자</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
      {post.post_type === 'Rounge' && (
        <Box sx={{ minWidth: 120, mt: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">라운지</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={post.rounge}
              label="RoungeMenu"
              onChange={(e) => setPost({ ...post, rounge: e.target.value })}
            >
              {userInfoList.valid_rounge.map((v: any) => {
                return (
                  <MenuItem value={v.url} key={v.url}>
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
          // severity={alertType}
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
      {imgList.map((v: any, i: number) => {
        return (
          <>
            <Box
              sx={{
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <img src={v[0]} style={{ maxWidth: '100%' }} key={i} />
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
                  console.log(imgList);
                }}
              />
            </Box>
          </>
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
        <Link href="/">
          <Button variant="contained">메인으로 이동</Button>
        </Link>
        <Button variant="contained" onClick={onSubmit}>
          {post.hasOwnProperty('timestamp') ? '게시물 수정' : '게시물 작성'}
        </Button>
      </Box>
    </Container>
  );
};

export default PostForm;

// export const getStaticProps = async (context: any) => {
//   const { currentUser }: any = useAuth();
//   const userId = currentUser.uid;

//   const docRef = doc(db, "users", userId);

//   const docSnap = await getDoc(docRef);

//   return {
//     props: { postProps: JSON.stringify(docSnap.data()) },
//   };
// };
//useAuth를 쓰지 못하는데 이런 경우에는 그냥 유저 정보를 props로 받아오는 것 밖에 답이 없는지?
