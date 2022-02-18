import React, { useState } from 'react';
import styled from '@emotion/styled';
import { signOut } from 'firebase/auth';
import { auth } from '@firebase/firebase';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { reset } from 'store/reducer';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const MyPageProfileLi = styled.div`
  margin-bottom: 50px;
  font-size: 1.2rem;
  width: 100%;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;

const MyPageLogOut: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [Open, setOpen] = useState<boolean>(false);

  const logOut = async () => {
    try {
      await signOut(auth);
      dispatch(reset());
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  const dialogOpen = () => {
    setOpen(true);
  };
  const dialogClose = () => {
    setOpen(false);
  };
  return (
    <>
      <div onClick={dialogOpen}>
        <MyPageProfileLi>
          <span>로그아웃</span>
          <ArrowForwardIosIcon color="disabled" />
        </MyPageProfileLi>
      </div>

      <Dialog
        open={Open}
        onClose={dialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'로그아웃 하시겠습니까?'}
        </DialogTitle>
        <DialogActions>
          <Button onClick={logOut} autoFocus>
            로그아웃
          </Button>
          <Button onClick={dialogClose}>돌아가기</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MyPageLogOut;
