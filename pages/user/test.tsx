import React, { useState, forwardRef } from 'react';
import { getDateTime } from '@utils/function';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { validateData, getOcrData } from '@utils/ocrDataValidation';
type OcrData = {
  b_no: string;
  start_dt: string;
  p_nm: string;
};
export default function Test1() {
  const timestamp = new Date().getTime();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageExt, setImageExt] = useState<string>('');
  const [ocrData, setOcrData] = useState<OcrData>({
    b_no: '',
    start_dt: '',
    p_nm: '',
  });

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const onImageChange = (e: any) => {
    const image = e.target.files[0] as File;
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = (finishedEvent: any) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setImageUrl(result.split(',')[1]);
    };
    setImageExt(e.target.value.split('.')[1]);
    e.target.value = '';
  };

  return (
    <>
      <input type="file" accept="image/*" onChange={onImageChange} />
      <button onClick={getOcrData}>Ocr</button>
      <button onClick={validateData}>result</button>
      <div>
        <Button variant="outlined" onClick={handleClickOpen}>
          Open alert dialog
        </Button>
        <Dialog
          open={dialogOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {'아래의 정보로 인증하시겠습니까?'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div>사업자등록번호: {ocrData.b_no}</div>
              <div>대표자: {ocrData.p_nm}</div>
              <div>개업년월일: {ocrData.start_dt}</div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={validateData} autoFocus>
              인증하기
            </Button>
            <Button onClick={handleClose}>다시 올리기</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
