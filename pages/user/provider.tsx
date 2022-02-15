import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import InputAdornment from '@mui/material/InputAdornment';
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
import { getStorage, ref, uploadString } from 'firebase/storage';
import { useRouter } from 'next/router';
import MenuItem from '@mui/material/MenuItem';
import { UserInfo } from '@interface/StoreInterface';

const jobSectors = [
  '외식·음료',
  '매장관리·판매',
  '서비스',
  '사무직',
  '고객상담·리서치·영업',
  '생산·건설·노무',
  'IT·기술',
  '디자인',
];
type UserInputData = {
  email: string;
  password: string;
  checkPassword: string;
  nickname: string;
  jobSector: string;
};

export default function Signup() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [checkPassword, setCheckPassword] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [isGoogle, setIsGoogle] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageExt, setImageExt] = useState<string>('');
  const [userInputs, setUserInputs] = useState<UserInputData>();
  const [inputHelper, setInputHelper] = useState<UserInputData>({
    email: '',
    password: '6자리 이상 입력 해 주세요',
    checkPassword: '비밀번호가 같지 않습니다.',
    nickname: '',
    jobSector: '직종을 선택 해 주세요',
  });
  const storage = getStorage();
  const { provider } = router.query;

  useEffect(() => {
    if (provider === 'google' && auth.currentUser) {
      const curUser = auth.currentUser;
      console.log('google account');
      setIsGoogle(true);
      setEmail(curUser?.email!);
      setPassword(curUser?.email!);
      setCheckPassword(curUser?.email!);
    }
  }, []);
  const [jobSector, setJobSector] = useState('');

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
    else if (name === 'checkPassword') setCheckPassword(value);
    else if (name === 'nickname') setNickname(value);
    else if (name === 'jobSector') setJobSector(value);

    // switch (name) {
    //   case 'password':
    //     if (value.length < 6) {
    //     }
    // }

    // const newUserInputs: any = {
    //   ...userInputs,
    //   [name]: value,
    // };
    // setUserInputs(newUserInputs);
  };

  const createUserWithEmail = async () => {
    try {
      const { user: result } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      sendEmailVerification(result);
      return result.uid;
    } catch (err: any) {
      setError(err.code);
    }
  };

  const getUid = async () => {
    if (isGoogle) {
      const user = auth.currentUser;
      return user!.uid;
    } else {
      return createUserWithEmail();
    }
  };
  const SignUpSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (checkPassword !== password) {
      alert('비밀번호가 다릅니다!');
    } else {
      const userInitData: Omit<UserInfo, 'id'> = {
        nickname: nickname,
        jobSector: jobSector,
        validRounges: [
          {
            title: '타임라인',
            url: 'timeline',
          },
        ],
        hasNewNotification: true,
        hasNewChatNotification: true,
        posts: [],
        email: email,
      };
      const user_id = await getUid();
      console.log(user_id);
      uploadImg(user_id!);
      console.log('success');
      const docSnap = await setDoc(doc(db, 'user', user_id!), userInitData);
      console.log(docSnap);
      await signOut(auth);
      router.push('/');
    }
  };

  const uploadImg = async (uid: string) => {
    const imageName = `${uid}.${imageExt}`;
    const imgRef = ref(storage, imageName);
    try {
      await uploadString(imgRef, imageUrl, 'data_url');
    } catch (e: any) {
      console.error(e);
    }
  };

  const checkNickname = async () => {
    const nicknameCheckQuery = query(
      collection(db, 'user'),
      where('nickname', '==', nickname),
    );
    const nicknameCheckSnap = await getDocs(nicknameCheckQuery);
    if (nicknameCheckSnap.docs.length !== 0) {
      const newInputHelper = {
        ...inputHelper,
        nickname: '닉네임이 중복되었습니다!',
      };

      setInputHelper(newInputHelper);
    }
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
  };
  const onClearImg = () => setImageUrl('');
  return (
    <>
      <Main>
        <h1 style={{ color: '#8946A6' }}>회원가입</h1>
        <form onSubmit={SignUpSubmitHandler}>
          <WrapContents>
            <WrapInput>
              <Label>Email</Label>
              <TextFields
                required
                placeholder="Email 주소를 입력해 주세요."
                name="email"
                value={email}
                onChange={onInputChange}
                helperText={inputHelper.email}
              />
            </WrapInput>
            <WrapInput>
              <Label>비밀번호</Label>
              <TextFields
                required
                disabled={isGoogle}
                fullWidth
                type="password"
                placeholder="비밀번호는 6자리 이상 입력해주세요."
                variant="outlined"
                margin="dense"
                name="password"
                value={password}
                onChange={onInputChange}
                helperText={inputHelper.password}
              />
              <TextFields
                required
                disabled={isGoogle}
                type="password"
                placeholder="비밀번호를 한 번더 입력해 주세요."
                variant="outlined"
                margin="dense"
                name="checkPassword"
                value={checkPassword}
                onChange={onInputChange}
                helperText={inputHelper.checkPassword}
              />
            </WrapInput>

            <WrapInput>
              <Label>닉네임</Label>
              <TextFields
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CheckButton type="button" onClick={checkNickname}>
                        중복확인
                      </CheckButton>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                margin="dense"
                name="nickname"
                placeholder="닉네임을 입력해 주세요."
                value={nickname}
                onChange={onInputChange}
                helperText={inputHelper.nickname}
              />
            </WrapInput>
            <WrapInput>
              <Label>증명서</Label>
              <label htmlFor="contained-button-file">
                <Input
                  accept="image/*"
                  id="contained-button-file"
                  type="file"
                  onChange={onImageChange}
                />
                <Button variant="contained" component="span">
                  Upload
                </Button>
              </label>
            </WrapInput>
            {imageUrl && (
              <WrapInput>
                <Button
                  variant="contained"
                  component="span"
                  onClick={onClearImg}
                >
                  사진 지우기
                </Button>

                <img
                  src={imageUrl}
                  alt={imageUrl}
                  width="150px"
                  height="200px"
                />
              </WrapInput>
            )}
            <WrapInput>
              <Label>직종</Label>
              <TextFields
                select
                variant="outlined"
                margin="dense"
                name="jobSector"
                value={jobSector}
                onChange={onInputChange}
                helperText={inputHelper.jobSector}
              >
                {jobSectors.map((value, idx) => (
                  <MenuItem key={idx} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextFields>
            </WrapInput>
            <SubmitButton type="submit">회원가입</SubmitButton>
          </WrapContents>
        </form>
      </Main>
    </>
  );
}

// export const getServerSideProps = async (
//   context: GetServerSidePropsContext,
// ) => {
//   const { provider } = context.query;

//   if (provider !== 'google' && provider !== 'signup') {
//     return {
//       redirect: {
//         permanent: false,
//         destination: '/404',
//       },
//     };
//   }
// };

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

const CheckButton = styled.button`
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
`;

const Label = styled.label`
  color: #8946a6;
  margin: 5px;
  ::after {
    content: '*';
    color: red;
  }
`;

const TextFields = styled(TextField)`
  color: #8946a6;
  margin: 5px;
`;
const Input = styled('input')({
  display: 'none',
});
