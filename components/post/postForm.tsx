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
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@firebase/firebase';
import { Box } from '@mui/system';
import { useAuth } from '@hooks/Auth';
import Router from 'next/router';
//select 부분을 위해서 사용
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Link from 'next/link';

const PostForm = () => {
  const { currentUser }: any = useAuth();

  const [userInfoList, setuserInfoList] = useState<any>('');
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [open, setOpen] = useState(false);

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

  const showAlert = (type: any, msg: any) => {
    setAlertType(type);
    setAlertMessage(msg);
    setOpen(true);
  };
  useEffect(() => {
    const findUserInfo = async () => {
      //uid로 user 파악함
      const docRef = doc(db, 'users', currentUser.uid);

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
      });
      const docRef = doc(db, 'users', currentUser.uid);
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
      });
      const docRef = doc(db, 'users', currentUser.uid);
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

  return (
    <Container maxWidth="sm">
      <Box sx={{ minWidth: 120, mt: 3 }}>
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
      {/* <Snackbar
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
      </Snackbar> */}

      <div>
        <TextField
          fullWidth
          label="제목"
          margin="normal"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
        />
        <TextField
          fullWidth
          label="내용"
          multiline
          minRows={10}
          value={post.content}
          onChange={(e) => setPost({ ...post, content: e.target.value })}
        />
        <Button variant="contained" sx={{ mt: 3 }} onClick={onSubmit}>
          {post.hasOwnProperty('timestamp') ? '게시물 수정' : '게시물 작성'}
        </Button>
        <Link href="/">
          <Button size="small">메인으로 이동</Button>
        </Link>
      </div>
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
