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
  getDocs,
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
import { RootReducer, updateOnePostAction } from 'store/reducer';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'next/router';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Modal from '@mui/material/Modal';
import { StoreState, UserState } from '@interface/StoreInterface';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { RoungePost, TopicPost } from '@interface/CardInterface';

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
const PostForm = (props: any) => {
  const dispatch = useDispatch();
  const postInfo = props.postInfo;
  const [diaOpen, setDiaOpen] = useState(false);
  // 이미지 업로드 부분
  const [postImage, setPostImage] = useState<any>(null);
  const [url, setUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [imgList, setImgList] = useState<any>(
    postInfo.images.map((v: any) => {
      return [v.url, v.imgName, v.imgDetail];
    }),
  );

  //텍스트 처리
  const { user }: UserState = useSelector((state: StoreState) => state.user);

  //유저
  const [uid, setUid] = useState<string>('');

  const [userInfoList, setuserInfoList] = useState<any>('');
  const [alertType, setAlertType] = useState<
    'error' | 'info' | 'success' | 'warning'
  >('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [clickState, setClickState] = useState(true);
  const [post, setPost] = useState({
    title: postInfo.title,
    content: postInfo.content,
    pressPerson: postInfo.pressPerson,
    postType: postInfo.postType,
    userId: postInfo.userId,
    createdAt: postInfo.createdAt,
    updatedAt: postInfo.updatedAt,
    job: postInfo.job,
    nickname: postInfo.nickname,
    images: postInfo.images,
    commentsCount: postInfo.commentsCount,
  });
  //rougne,topic info 확인
  const [postTopic, setPostTopic] = useState<any>({});
  const [postRounge, setPostRounge] = useState<any>({});

  //photoupload 확인 아이콘-아직 미구현
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  //모달창
  const [modalOpen, setModalOpen] = useState(false);
  //rougne,topic info 확인
  useEffect(() => {
    if (postInfo.topic) {
      setPostTopic(postInfo.topic);
    }
    if (postInfo.rounge) {
      setPostRounge(postInfo.rounge);
    }
  }, [postInfo]);

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

  const handleClose: any = (event: any, reason: any) => {
    setDiaOpen(!diaOpen);
  };
  const handAlertClose = () => {
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
    if (post.title === '' || post.content === '') {
      showAlert('error', `필수항목을 작성해 주세요`);
    } else {
      const docRef = doc(db, 'post', props.thisPostId);

      if (postInfo.topic) {
        const postUpdated = {
          ...post,
          updatedAt: serverTimestamp(),
          images: images,
          topic: postInfo.topic,
        };
        updateDoc(docRef, postUpdated);
        setPost(postUpdated);
        props.setUpdateTime(Date.now());

        setDiaOpen(true);
        dispatch(
          updateOnePostAction({
            postId: props.thisPostId,
            // @ts-ignore
            postData: post,
          }),
        );
      }
      if (postInfo.rounge) {
        delete post.createdAt;
        const postUpdated = {
          ...post,
          updatedAt: serverTimestamp(),
          images: images,
          rounge: postInfo.rounge,
        };
        updateDoc(docRef, postUpdated);
        setPost(postUpdated);
        props.setUpdateTime(Date.now());
        setDiaOpen(true);
        dispatch(
          // @ts-ignore
          updateOnePostAction({ postId: props.thisPostId, postData: post }),
        );
      }

      //나중에 topic 페이지로 이동하도록 변경하기
      // props.setEditOpen(false);
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
  console.log(user);
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

  //취소버튼 구현
  function editChange() {
    props.setEditOpen(false);
  }
  function sendEditContent() {
    props.setPost(post);
    setModalOpen(true);
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ minWidth: 120, mt: 6 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">등록위치</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            inputProps={{ readOnly: true }}
            value={postInfo.postType}
            label="postMenu"
            onClick={() => showAlert('info', `등록 위치는 변경할 수 없습니다`)}
          >
            <MenuItem value={'rounge'}>라운지</MenuItem>
            <MenuItem value={'topic'}>토픽</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {postInfo.postType === 'topic' && (
        <Box sx={{ minWidth: 120, mt: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">토픽</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="postMenu"
              inputProps={{ readOnly: true }}
              value={postInfo.topic.title}
              onClick={() =>
                showAlert('info', `등록 위치는 변경할 수 없습니다`)
              }
            >
              <MenuItem value={'연말정산'}>연말정산</MenuItem>
              <MenuItem value={'여행'}>자유시장</MenuItem>
              <MenuItem value={'블라블라'}>블라블라</MenuItem>
              <MenuItem value={'주식투자'}>주식투자</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
      {postInfo.postType === 'rounge' && (
        <Box sx={{ minWidth: 120, mt: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">라운지</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="RoungeMenu"
              inputProps={{ readOnly: true }}
              value={postInfo.rounge.title}
              onClick={() =>
                showAlert('info', `등록 위치는 변경할 수 없습니다`)
              }
            >
              {user.validRounges &&
                user.validRounges.map((v: any) => {
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
          onClose={handAlertClose}
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
          <Box
            key={i}
            sx={{
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mt: 2,
            }}
          >
            <img src={v[0]} alt={v[0]} style={{ maxWidth: '100%' }} key={i} />
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
              value={v[2]}
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
        <Button variant="contained" onClick={editChange}>
          취소
        </Button>

        <Button variant="contained" onClick={onSubmit}>
          수정하기
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
          props.setEditOpen(false);
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
            게시물을 수정하였습니다
          </Typography>
        </Box>
      </Modal>
      <Dialog
        open={diaOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.thisPostTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            이 게시물을 수정하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={sendEditContent} autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PostForm;
