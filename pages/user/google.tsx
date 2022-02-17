import React, { useState, useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { signOut } from 'firebase/auth';
import { db, auth } from '@firebase/firebase';
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
} from 'firebase/firestore';

import { useRouter } from 'next/router';
import MenuItem from '@mui/material/MenuItem';
import { UserInfo, Rounge } from '@interface/StoreInterface';
import { HomeListUrlString } from '@interface/GetPostsInterface';
import { UserInputData, userInputInitialState, jobSectors } from './constants';
import { getAuth } from 'firebase/auth';
import {
  userInputValidation,
  inputErrorCheck,
} from '@utils/userInputValidation';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { validateData, getOcrData } from '@utils/ocrDataValidation';
import { uploadImg } from '@utils/signupForm';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const reducer = (state: UserInputData, action: any) => {
  return {
    ...state,
    [action.type]: { value: action.payload.value, error: action.payload.error },
  };
};
type OcrData = {
  b_no: string;
  start_dt: string;
  p_nm: string;
};
export default function Google() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [inputState, inputDispatch] = useReducer(
    reducer,
    userInputInitialState,
  );
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageExt, setImageExt] = useState<string>('');
  const [nicknameBtnChecked, setNicknameBtnChecked] = useState<boolean>(false);
  const [imageOcrChecked, setImageOcrChecked] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [ocrData, setOcrData] = useState<OcrData>({
    b_no: '',
    start_dt: '',
    p_nm: '',
  });
  const { email, nickname, jobSector } = inputState;
  useEffect(() => {
    const auth = getAuth();
    const curUser = auth.currentUser;
    console.log('google account');
    inputDispatch({
      type: 'email',
      payload: { value: curUser?.email, error: '' },
    });
    console.log(inputState);
  }, []);

  const handleClose = () => {
    setDialogOpen(false);
  };

  const SignUpSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uid = auth.currentUser?.uid as string;
    if (!uid) {
      alert('다시 로그인 해주세요!');
      router.push('/user/login');
    }
    if (!imageUrl) {
      alert('증명서 파일을 찾을 수 없습니다!');
      return;
    }
    const success = inputErrorCheck(inputState);
    if (success) {
      const userData: UserInfo = {
        nickname: nickname.value,
        jobSector: jobSector.value,
        validRounges: [
          {
            title: '타임라인',
            url: 'timeline',
          },
          {
            title: '토픽',
            url: 'topic',
          },
          {
            title: jobSector.value,
            url: jobSectors.find((v) => v.title === jobSector.value)
              ?.url as HomeListUrlString,
          } as Rounge,
        ],
        id: uid,
        hasNewNotification: false,
        hasNewChatNotification: false,
        posts: [],
        email: email.value,
      };
      uploadImg(uid, imageExt, imageUrl);
      const docSnap = await setDoc(doc(db, 'user', uid), userData);
      await signOut(auth);
      router.push('/user/login');
    }
  };

  const checkNickname = async () => {
    const nicknameCheckQuery = query(
      collection(db, 'user'),
      where('nickname', '==', nickname.value),
    );
    const nicknameCheckSnap = await getDocs(nicknameCheckQuery);
    let nicknameHelperText;
    if (nicknameCheckSnap.docs.length !== 0 || nickname.value.length < 3) {
      nicknameHelperText = '사용 불가능한 닉네임 입니다!';
      alert(nicknameHelperText);
    } else {
      nicknameHelperText = '';
      alert('사용 가능한 닉네임 입니다!');
      setNicknameBtnChecked(true);
    }

    inputDispatch({
      type: 'nickname',
      payload: { value: nickname.value, error: nicknameHelperText },
    });
  };

  const getImageToString = async () => {
    const result = await getOcrData(imageUrl, imageExt);
    if (!result) {
      alert('증명서에서 데이터를 가지고 오지 못했습니다!');
      resetOcrData();
    } else {
      const { b_no, p_nm, start_dt } = result as OcrData;
      const newOcrData = { b_no, p_nm, start_dt };
      setOcrData(newOcrData);
      setDialogOpen(true);
    }
  };

  const validateOcrData = async () => {
    const validateResult = await validateData(ocrData);
    if (validateResult) {
      alert('인증 성공!');
      setImageOcrChecked(true);
      handleClose();
    } else {
      alert('인증 실패! 증명서를 다시 확인 해 주세요!');
      handleClose();
    }
  };

  const resetOcrData = () => {
    const resetOcrData = { b_no: '', p_nm: '', start_dt: '' };
    setOcrData(resetOcrData);
  };

  const onImageChange = (e: any) => {
    const image = e.target.files[0]!;
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = (finishedEvent: any) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setImageUrl(result);
    };
    setImageExt(e.target.value.split('.')[1]);
    e.target.value = '';
    setImageOcrChecked(false);

    resetOcrData();
  };

  const onClearImg = () => {
    setImageUrl('');
    setImageOcrChecked(false);
    resetOcrData();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'nickname' && nicknameBtnChecked) {
      setNicknameBtnChecked(false);
    }
    const error = userInputValidation(name, value);
    inputDispatch({ type: name, payload: { value, error } });
  };

  return (
    <>
      <Main>
        <h1 style={{ color: '#8946A6' }}>회원가입</h1>
        <form onSubmit={SignUpSubmitHandler}>
          <WrapContents>
            <WrapInput>
              <Label>Email</Label>
              <TextFields required disabled name="email" value={email.value} />
            </WrapInput>
            <WrapInput>
              <Label>닉네임</Label>
              <TextFields
                required
                error={nickname.error ? true : false}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CheckButton
                        type="button"
                        onClick={checkNickname}
                        disabled={nicknameBtnChecked}
                      >
                        중복확인
                      </CheckButton>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                margin="dense"
                name="nickname"
                placeholder="닉네임을 입력해 주세요."
                value={nickname.value}
                onChange={onInputChange}
                helperText={nickname.error}
              />
            </WrapInput>
            <WrapImageUpload>
              <Label>증명서</Label>
              <label
                htmlFor="contained-button-file"
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <Input
                  accept="image/*"
                  id="contained-button-file"
                  type="file"
                  onChange={onImageChange}
                />
                <Button
                  variant="contained"
                  component="span"
                  style={{ background: '#8946a6', marginLeft: 10 }}
                >
                  <CameraAltIcon style={{ marginRight: '5px' }} />
                  파일 선택
                </Button>
              </label>
              <Button
                variant="contained"
                component="span"
                onClick={onClearImg}
                style={{ background: '#8946a6', marginLeft: 10 }}
              >
                <DeleteForeverIcon style={{ marginRight: '5px' }} />
                사진 지우기
              </Button>
            </WrapImageUpload>
            {imageUrl && (
              <>
                <img
                  src={imageUrl}
                  alt={imageUrl}
                  width="150px"
                  height="200px"
                />
                <OcrButton
                  type="button"
                  variant="contained"
                  disabled={imageOcrChecked}
                  onClick={getImageToString}
                >
                  인증하기
                </OcrButton>
              </>
            )}
            <WrapInput>
              <Label>직종</Label>
              <TextFields
                select
                error={jobSector.error ? true : false}
                variant="outlined"
                margin="dense"
                name="jobSector"
                value={jobSector.value}
                onChange={onInputChange}
                helperText={jobSector.error}
              >
                {jobSectors.map((value, idx) => (
                  <MenuItem key={idx} value={value.title}>
                    {value.title}
                  </MenuItem>
                ))}
              </TextFields>
            </WrapInput>
            <SubmitButton type="submit" disabled={!nicknameBtnChecked}>
              <GroupAddIcon style={{ marginRight: '10px' }} />
              회원가입
            </SubmitButton>
          </WrapContents>
        </form>
        <>
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
                <text>사업자등록번호: {ocrData.b_no}</text>
                <text>대표자: {ocrData.p_nm}</text>
                <text>개업년월일: {ocrData.start_dt}</text>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={validateOcrData} autoFocus>
                인증하기
              </Button>
              <Button onClick={handleClose}>다시 올리기</Button>
            </DialogActions>
          </Dialog>
        </>
      </Main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  if (!context.req.headers.referer) {
    context.res.statusCode = 302;
    context.res.setHeader('Location', `/`);
    context.res.end();
  }
  return { props: {} };
};

const Main = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const WrapContents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WrapInput = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
  width: 100%;
`;

const WrapImageUpload = styled.div`
  display: flex;
  flex-direction: row;
  margin: 20px;
  width: 100%;
`;

const CheckButton = styled.button`
  display: flex;
  align-items: center;
  background: #8946a6;
  border-radius: 5px;
  border: none;
  color: white;
  width: 60px;
  height: 24px;
  margin: 5px;
  font-size: 12px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
  :disabled {
    background: gray;
  }
`;

const SubmitButton = styled.button`
  background: #8946a6;
  border-radius: 5px;
  border: none;
  color: white;
  width: 173px;
  height: 58px;
  font-size: 20px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
  :disabled {
    background: gray;
  }
`;

const Label = styled.label`
  color: #8946a6;
  margin: 5px;
  ::after {
    content: '*';
    color: red;
  }
`;
const Input = styled('input')({
  display: 'none',
});

const TextFields = styled(TextField)`
  color: #8946a6;
  margin: 5px;
`;

const OcrButton = styled(Button)`
  background: #8946a6;
  margin-top: 15px;
  :disabled {
    background: 'gray';
  }
  :hover {
    opacity: 0.8;
    background: #8946a6;
  }
`;
