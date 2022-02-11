import React, { useState } from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import TextField from '@mui/material/TextField';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { db, auth } from '@firebase/firebase';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const provider = new GoogleAuthProvider();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onChangeInput = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
  };

  const loginWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // The signed-in user info.
        const user = result.user;
        console.log(user.uid);
        const docSnap = await getDoc(doc(db, 'user', user.uid));
        if (docSnap.exists()) {
          console.log('이미 가입되어 있습니다.');
          router.push('/');
        } else {
          console.log('가입되어있지 않습니다.');
          router.push('/user/google');
        }
        // ...
      })
      .catch((error) => {
        console.error(error);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const SignUpSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        router.push('/');
      })
      .catch((error) => console.log(error.code, error.message));
  };
  return (
    <>
      <Main>
        <h1 style={{ color: '#8946A6' }}>로그인</h1>
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
                value={email}
                onChange={onChangeInput}
              />
            </WrapInput>
            <WrapInput>
              <Label>비밀번호</Label>
              <TextField
                required
                fullWidth
                type="password"
                variant="outlined"
                margin="dense"
                name="password"
                value={password}
                onChange={onChangeInput}
              />
            </WrapInput>
            <WrapButton>
              <Button>
                <Link href="/user/signup">회원가입</Link>
              </Button>
              <Button type="button" onClick={loginWithGoogle}>
                Google
              </Button>
            </WrapButton>
            <SubmitButton type="submit">로그인</SubmitButton>
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

const Button = styled.button`
  background: #8946a6;
  border-radius: 5px;
  border: none;
  color: white;
  width: 80px;
  height: 24px;
  font-size: 12px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const WrapButton = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px;
  width: 313px;
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
`;
