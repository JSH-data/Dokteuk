import React, { useState } from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import TextField from '@mui/material/TextField';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@firebase/firebase';
import { useRouter } from 'next/router';
import { setNewUserInfo } from '@store/reducer';

import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GoogleIcon from '@mui/icons-material/Google';
import LoginIcon from '@mui/icons-material/Login';
import Layout from '@layouts/Layout';

export default function Login() {
  const router = useRouter();
  const provider = new GoogleAuthProvider();
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const onChangeInput = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
    console.log(e.target.value);
  };

  const checkSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user.uid;
    } catch (err: any) {
      console.error(err);
    }
  };

  const loginWithGoogle = async () => {
    const uid = await checkSignIn();
    const docSnap = await getDoc(doc(db, 'user', uid as string));
    if (docSnap.exists()) {
      dispatch(setNewUserInfo(docSnap.data()));
      router.push('/');
    } else {
      router.push('/user/google');
    }
  };
  const loginWithEmail = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user.uid;
    } catch (err: any) {
      console.error(err);
    }
  };

  const SignUpSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uid = await loginWithEmail();
    if (uid) {
      const docSnap = await getDoc(doc(db, 'user', uid as string));
      dispatch(setNewUserInfo(docSnap.data()));
      router.push('/');
    }
  };
  return (
    <>
      <Main>
        <Title>로그인</Title>
        <form onSubmit={SignUpSubmitHandler}>
          <WrapContents>
            <WrapInput>
              <Label>Email</Label>
              <TextField
                required
                fullWidth
                variant="outlined"
                margin="dense"
                name="email"
                onChange={onChangeInput}
              />
            </WrapInput>
            <WrapInput>
              <Label>비밀번호</Label>
              <TextField
                required
                type="password"
                variant="outlined"
                margin="dense"
                name="password"
                onChange={onChangeInput}
              />
            </WrapInput>
            <WrapButton>
              <Link href="/user/signup" passHref>
                <Button type="button">
                  <GroupAddIcon style={{ marginRight: '10px' }} />
                  회원가입
                </Button>
              </Link>

              <Button type="button" onClick={loginWithGoogle}>
                <GoogleIcon style={{ marginRight: '10px' }} />
                Google
              </Button>
            </WrapButton>
            <SubmitButton type="submit">
              <LoginIcon style={{ marginRight: '10px' }} />
              로그인
            </SubmitButton>
          </WrapContents>
        </form>
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

  @media (prefers-color-scheme: dark) {
    & .MuiOutlinedInput-input {
      color: white;
    }
    & .MuiOutlinedInput-root {
      border: 1px solid ${({ theme }: any) => theme.darkGray};
    }
  }
`;

const WrapInput = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
  width: 100%;
`;

const Button = styled.button`
  background: ${({ theme }: any) => theme.mainColorViolet};
  border-radius: 5px;
  border: none;
  color: white;
  width: 100px;
  height: 35px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  :hover {
    opacity: 0.8;
  }

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) => theme.mainColorBlue};
  }
`;

const WrapButton = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  width: 313px;
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
  :hover {
    opacity: 0.8;
  }

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) => theme.mainColorBlue};
  }
`;

const Label = styled.label`
  color: ${({ theme }: any) => theme.mainColorViolet};
  margin: 5px;

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }: any) => theme.mainColorBlue};
  }
`;
