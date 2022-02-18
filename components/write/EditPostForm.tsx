import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  Button,
  Container,
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
import { serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { db } from '@firebase/firebase';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

//photoupload용 아이콘
import { updateOnePostAction } from 'store/reducer';
import { useDispatch, useSelector } from 'react-redux';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import Modal from '@mui/material/Modal';
import { StoreState, UserState } from '@interface/StoreInterface';

import styled from '@emotion/styled';

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
const ContainerStyled = styled(Container)`
  & .MuiOutlinedInput-input {
    color: black;
  }
  & label {
    color: ${({ theme }: any) => theme.darkGray};
  }
  & .MuiOutlinedInput-notchedOutline {
    border: 1px solid ${({ theme }: any) => theme.darkGray};
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
  }
`;

const DialogStyled = styled(Dialog)`
  & .MuiDialog-paper {
    background: white;
  }
  & .MuiDialogContentText-root {
    color: black;
  }
  @media (prefers-color-scheme: dark) {
    & .MuiDialog-paper {
      background: ${({ theme }: any) => theme.blackGray};
    }
    & .MuiDialogContentText-root {
      color: white;
    }
  }
`;
const ModalStyled = styled(Modal)`
  & .css-1vocdem {
    background: white;
    color: black;
  }

  @media (prefers-color-scheme: dark) {
    & .css-1vocdem {
      background: ${({ theme }: any) => theme.blackGray};
      color: white;
    }
  }
`;

const PostForm = (props: any) => {
  const dispatch = useDispatch();
  const postInfo = props.postInfo;
  const [diaOpen, setDiaOpen] = useState(false);

  const [url, setUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [imgList, setImgList] = useState<any>(
    postInfo.images.map((v: any) => {
      return [v.url, v.imgName, v.imgDetail];
    }),
  );

  //텍스트 처리
  const { user }: UserState = useSelector((state: StoreState) => state.user);

  const [alertType, setAlertType] = useState<
    'error' | 'info' | 'success' | 'warning'
  >('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [open, setOpen] = useState(false);

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

  const [modalOpen, setModalOpen] = useState(false);

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

  const handleClose = () => {
    setDiaOpen(!diaOpen);
  };
  const handAlertClose = () => {
    setOpen(!open);
  };

  const onSubmit = async () => {
    let images: Array<Object> = [];
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
            postData: { ...post, images: post.images.map((v) => v.url) },
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
          updateOnePostAction({
            postId: props.thisPostId,
            // @ts-ignore
            postData: {
              ...post,
              // @ts-ignore
              images: post.images.map((v) => v.url),
            },
          }),
        );
      }
    }
  };

  const handleUploadChange = (e: any) => {
    if (e.target.files[0]) {
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
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: string) => {
          setUrl(url);
          //[이미지 다운로드 url, firebase에 저장한 이미지 이름, 이미지 설명]
          setImgList([...imgList, [downloadURL, postImage.name, '']]);
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
      .catch(() => {
        showAlert(
          'error',
          `사진 삭제 중 오류가 발생했습니다 다시 시도해 주세요`,
        );
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
    <ContainerStyled maxWidth="sm">
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
      <ModalStyled
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
      </ModalStyled>
      <DialogStyled
        open={diaOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
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
      </DialogStyled>
    </ContainerStyled>
  );
};

export default PostForm;
