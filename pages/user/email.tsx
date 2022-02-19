import React, { useState, useReducer } from 'react';

import styled from '@emotion/styled';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
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
import {
  userInputInitialState,
  jobSectors,
  UserInputData,
  OcrData,
  UserInputDataAction,
} from '@interface/constants';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {
  userFormValidation,
  userInputChangeValidation,
} from '@utils/userInputValidation';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { validateData, getOcrData } from '@utils/ocrDataValidation';
import { uploadImg } from '@utils/signupForm';
import CircularProgress from '@mui/material/CircularProgress';
import { reg_email } from '@interface/constants';
const reducer = (state: UserInputData, action: UserInputDataAction) => {
  return {
    ...state,
    [action.type]: { value: action.payload.value, error: action.payload.error },
  };
};

export default function Signup() {
  const router = useRouter();
  const [inputState, inputDispatch] = useReducer(
    reducer,
    userInputInitialState,
  );
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageExt, setImageExt] = useState<string>('');
  const [nicknameBtnChecked, setNicknameBtnChecked] = useState<boolean>(false);
  const [emailBtnChecked, setEmailBtnChecked] = useState<boolean>(false);
  const [imageOcrChecked, setImageOcrChecked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [ocrData, setOcrData] = useState<OcrData>({
    b_no: '',
    start_dt: '',
    p_nm: '',
  });

  const [emailSuccess, setEmailSuccess] = useState<string>('');
  const [nicknameSuccess, setNicknameSuccess] = useState<string>('');
  const { email, password, checkPassword, nickname, jobSector } = inputState;

  const handleClose = () => {
    setDialogOpen(false);
    setIsLoading(false);
  };

  const createUserWithEmail = async () => {
    try {
      const { user: result } = await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value,
      );
      sendEmailVerification(result);
      return result.uid;
    } catch (error) {
      console.error(error);
    }
  };

  const SignUpSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!imageUrl) {
      alert('증명서 파일을 찾을 수 없습니다!');
      return;
    }

    const uid = (await createUserWithEmail()) as string;
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
    await setDoc(doc(db, 'user', uid), userData);
    await signOut(auth);
    router.push('/user/login');
  };

  const checkEmail = async () => {
    const emailCheckQuery = query(
      collection(db, 'user'),
      where('email', '==', email.value),
    );
    let emailHelperText;
    const emailCheckSnap = await getDocs(emailCheckQuery);
    if (
      emailCheckSnap.docs.length !== 0 ||
      email.value.length < 3 ||
      !reg_email.test(email.value)
    ) {
      emailHelperText = '사용 불가능한 이메일 입니다!';
    } else {
      emailHelperText = '';
      setEmailSuccess('사용 가능한 이메일 입니다!');
      setEmailBtnChecked(true);
    }

    inputDispatch({
      type: 'email',
      payload: { value: email.value, error: emailHelperText },
    });
  };

  const checkNickname = async () => {
    const nicknameCheckQuery = query(
      collection(db, 'user'),
      where('nickname', '==', nickname.value),
    );
    let nicknameHelperText;
    const nicknameCheckSnap = await getDocs(nicknameCheckQuery);
    if (nicknameCheckSnap.docs.length !== 0 || nickname.value.length < 3) {
      nicknameHelperText = '사용 불가능한 닉네임 입니다!';
    } else {
      nicknameHelperText = '';
      setNicknameBtnChecked(true);
      setNicknameSuccess('사용 가능한 닉네임 입니다!');
    }

    inputDispatch({
      type: 'nickname',
      payload: { value: nickname.value, error: nicknameHelperText },
    });
  };

  const getImageToString = async () => {
    setIsLoading(true);
    const result = await getOcrData(imageUrl, imageExt);
    setIsLoading(false);
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
    setIsLoading(true);
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
  const submitButtonDisabled = () => {
    if (userFormValidation(inputState).length !== 0) {
      return true;
    } else {
      return !(nicknameBtnChecked && emailBtnChecked && imageOcrChecked);
    }
  };
  const resetOcrData = () => {
    const resetOcrData = { b_no: '', p_nm: '', start_dt: '' };
    setOcrData(resetOcrData);
  };

  const onImageChange = (e: any) => {
    const image = e.target.files[0] as File;
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
  const passwordCheck = (value: string) => {
    let errorMessage = '';
    if (checkPassword.value !== value) {
      errorMessage = '비밀번호가 다릅니다!';
    }
    inputDispatch({
      type: 'checkPassword',
      payload: { value: checkPassword.value, error: errorMessage },
    });
  };
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'nickname' && nicknameBtnChecked) {
      setNicknameBtnChecked(false);
      setNicknameSuccess('');
    }
    if (name === 'email' && emailBtnChecked) {
      setEmailBtnChecked(false);
      setEmailSuccess('');
    }

    if (name === 'password') {
      passwordCheck(value);
    }

    const error = userInputChangeValidation(name, value, inputState);
    inputDispatch({ type: name, payload: { value, error } });
  };
  return (
    <>
      <Main>
        <Title>회원가입</Title>
        <form onSubmit={SignUpSubmitHandler}>
          <WrapContents>
            <WrapInput>
              <Label>Email</Label>
              <TextFields
                required
                error={email.error ? true : false}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CheckButton
                        type="button"
                        onClick={checkEmail}
                        disabled={emailBtnChecked}
                      >
                        중복확인
                      </CheckButton>
                    </InputAdornment>
                  ),
                }}
                placeholder="Email 주소를 입력해 주세요."
                name="email"
                value={email.value}
                onChange={onInputChange}
                helperText={email.error}
              />
              {emailSuccess && (
                <StyledFormHelperText>{emailSuccess}</StyledFormHelperText>
              )}
            </WrapInput>
            <WrapInput>
              <Label>비밀번호</Label>
              <TextFields
                required
                type="password"
                error={password.error ? true : false}
                placeholder="비밀번호는 6자리 이상 입력해주세요."
                variant="outlined"
                margin="dense"
                name="password"
                value={password.value}
                onChange={onInputChange}
                helperText={password.error}
              />
              <Label>비밀번호 확인</Label>
              <TextFields
                required
                type="password"
                error={checkPassword.error ? true : false}
                placeholder="비밀번호를 한 번더 입력해 주세요."
                variant="outlined"
                margin="dense"
                name="checkPassword"
                value={checkPassword.value}
                onChange={onInputChange}
                helperText={checkPassword.error}
              />
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
              {nicknameSuccess && (
                <StyledFormHelperText>{nicknameSuccess}</StyledFormHelperText>
              )}
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
                <ButtonStyled variant="contained" component="span">
                  <CameraAltIcon style={{ marginRight: '5px' }} />
                  파일 선택
                </ButtonStyled>
              </label>
              <ButtonStyled
                variant="contained"
                component="span"
                onClick={onClearImg}
              >
                <DeleteForeverIcon style={{ marginRight: '5px' }} />
                사진 지우기
              </ButtonStyled>
            </WrapImageUpload>
            {imageUrl && (
              <>
                <img
                  src={imageUrl}
                  alt={imageUrl}
                  width="150px"
                  height="200px"
                />
                <WrapButton>
                  <OcrButton
                    type="button"
                    variant="contained"
                    disabled={imageOcrChecked}
                    onClick={getImageToString}
                  >
                    <FactCheckIcon style={{ marginRight: '5px' }} />
                    인증하기
                  </OcrButton>
                  {isLoading && <StyledCircularProgress />}
                </WrapButton>
              </>
            )}
            <WrapInput>
              <Label>직종</Label>
              <TextFields
                required
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

            <SubmitButton type="submit" disabled={submitButtonDisabled()}>
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
                사업자등록번호: {ocrData.b_no}
                <br />
                대표자: {ocrData.p_nm}
                <br />
                개업년월일: {ocrData.start_dt}
                <br />
              </DialogContentText>
            </DialogContent>
            <DialogActions style={{ color: '#8946a6' }}>
              <DialogButton onClick={validateOcrData} autoFocus>
                인증하기
              </DialogButton>
              <DialogButton onClick={handleClose}>다시 올리기</DialogButton>
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

const Title = styled.h1`
  color: ${({ theme }: any) => theme.mainColorViolet};

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }: any) => theme.mainColorBlue};
  }
`;

const Main = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const WrapContents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  & .MuiOutlinedInput-input {
    color: black;
  }
  & .MuiOutlinedInput-root {
    border: 1px solid ${({ theme }: any) => theme.lightGray};
  }

  & input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #eaeaea inset;
    border-radius: 0;
    -webkit-text-fill-color: #000000 !important;
  }

  @media (prefers-color-scheme: dark) {
    & .MuiFormHelperText-root {
      color: ${({ theme }: any) => theme.lightGray};
    }
    & .MuiOutlinedInput-input {
      color: white;
    }
    & .MuiOutlinedInput-root {
      border: 1px solid ${({ theme }: any) => theme.darkGray};
    }
    & .MuiSvgIcon-root {
      color: ${({ theme }: any) => theme.lightGray};
    }
    & input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px #111113 inset;
      border-radius: 0;
      -webkit-text-fill-color: #fff !important;
      caret-color: white;
    }
  }
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

const ButtonStyled = styled(Button)<{ component: string }>`
  margin-left: 10px;
  background: ${({ theme }: any) => theme.mainColorViolet};

  :hover {
    opacity: 0.8;

    background: ${({ theme }: any) => theme.mainColorViolet};
  }
  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) => theme.mainColorBlue};
    :hover {
      opacity: 0.8;
      @media (prefers-color-scheme: dark) {
        background: ${({ theme }: any) => theme.mainColorBlue};
      }
    }
  }
`;

const CheckButton = styled.button`
  background: ${({ theme }: any) => theme.mainColorViolet};
  border-radius: 5px;
  border: none;
  color: white;
  width: 75px;
  height: 25px;
  margin: 5px;
  font-size: 12px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
  :disabled {
    background: gray;
  }
  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) => theme.mainColorBlue};
  }
`;

const SubmitButton = styled.button`
  background: ${({ theme }: any) => theme.mainColorViolet};
  border-radius: 5px;
  border: none;
  color: white;
  width: 173px;
  height: 58px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
  :hover {
    opacity: 0.8;
  }
  :disabled {
    background: gray;
  }
  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) => theme.mainColorBlue};
  }
`;

const Label = styled.label`
  color: ${({ theme }: any) => theme.mainColorViolet};
  margin: 5px;
  ::after {
    content: '*';
    color: red;
  }
  @media (prefers-color-scheme: dark) {
    color: ${({ theme }: any) => theme.mainColorBlue};
  }
`;

const Input = styled('input')({
  display: 'none',
});

const TextFields = styled(TextField)`
  color: ${({ theme }: any) => theme.mainColorViolet};
  margin: 5px;
`;
const DialogButton = styled(Button)`
  color: ${({ theme }: any) => theme.mainColorViolet};

  :hover {
    opacity: 0.8;
  }

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }: any) => theme.mainColorBlue};
  }
`;
const OcrButton = styled(Button)`
  background: ${({ theme }: any) => theme.mainColorViolet};
  margin-top: 15px;
  :disabled {
    background: 'gray';
  }
  :hover {
    opacity: 0.8;
    background: ${({ theme }: any) => theme.mainColorViolet};
  }
  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) => theme.mainColorBlue};
    :hover {
      opacity: 0.8;
      background: ${({ theme }: any) => theme.mainColorBlue};
    }
    :disabled {
      background: 'gray';
    }
  }
`;

const StyledCircularProgress = styled(CircularProgress)`
  color: ${({ theme }: any) => theme.mainColorViolet};
  margin-left: 10px;
  margin-top: 15px;

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }: any) => theme.mainColorBlue};
    margin-left: 10px;
    margin-top: 15px;
  }
`;

const StyledFormHelperText = styled(FormHelperText)`
  color: ${({ theme }: any) => theme.mainColorViolet};
  margin-left: 10px;

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }: any) => theme.mainColorBlue};
    margin-left: 10px;
  }
`;

const WrapButton = styled.div`
  margin: 10px;
  align-item: center;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;
