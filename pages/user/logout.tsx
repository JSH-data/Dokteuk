import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@firebase/firebase';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { reset } from 'store/reducer';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
export default function Logout() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState<boolean>(true);
  const logOut = async () => {
    try {
      await signOut(auth);
      dispatch(reset());
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    router.back();
  };

  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
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
          <Button onClick={() => router.back()}>돌아가기</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
