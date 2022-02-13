import React, { useState, useEffect } from 'react';
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
  '미디어',
  '운전·배달',
  '병원·간호·연구',
  '교육·강사',
];

type UserInputData = {
  nickname: string;
  jobSector: string;
};

export default function Google() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>('');

  const [nickname, setNickname] = useState<string>('');
  const [isGoogle, setIsGoogle] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageExt, setImageExt] = useState<string>('');

  const [inputHelpers, setInputHelpers] = useState<UserInputData>({
    nickname: '',
    jobSector: '직종을 선택 해 주세요',
  });
  const storage = getStorage();

  useEffect(() => {
    const curUser = auth.currentUser;
    console.log('google account');
    setIsGoogle(true);
    setEmail(curUser?.email!);
  }, []);

  const [jobSector, setJobSector] = useState('');

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let helperText;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'jobSector') setJobSector(value);
  };

  const SignUpSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uid = auth.currentUser?.uid as string;
    const userInitData: UserInfo = {
      nickname: nickname,
      jobSector: jobSector,
      validRounges: [
        {
          title: '타임라인',
          url: 'timeline',
        },
        {
          title: '토픽',
          url: 'topic',
        },
      ],
      id: uid,
      hasNewNotification: true,
      posts: [],
      email: email,
    };

    uploadImg(uid!);
    console.log('success');
    const docSnap = await setDoc(doc(db, 'user', uid!), userInitData);
    console.log(docSnap);
    await signOut(auth);
    router.push('/user/login');
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
    let nicknameHelperText;
    if (nicknameCheckSnap.docs.length !== 0 || nickname.length < 3) {
      nicknameHelperText = '사용 불가능한 닉네임 입니다!';
    } else {
      nicknameHelperText = '사용 가능한 닉네임 입니다!';
    }

    const newInputHelper = {
      ...inputHelpers,
      nickname: nicknameHelperText,
    };

    setInputHelpers(newInputHelper);
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
                disabled
                name="email"
                value={email}
                onChange={onInputChange}
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
                helperText={inputHelpers.nickname}
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
                  파일 선택
                </Button>
              </label>
              <Button
                variant="contained"
                component="span"
                onClick={onClearImg}
                style={{ background: '#8946a6', marginLeft: 10 }}
              >
                사진 지우기
              </Button>
            </WrapImageUpload>
            {imageUrl && <img src={imageUrl} width="150px" height="200px" />}
            <WrapInput>
              <Label>직종</Label>
              <TextFields
                select
                variant="outlined"
                margin="dense"
                name="jobSector"
                value={jobSector}
                onChange={onInputChange}
                helperText={inputHelpers.jobSector}
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
const Input = styled('input')({
  display: 'none',
});

const TextFields = styled(TextField)`
  color: #8946a6;
  margin: 5px;
`;
