import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@firebase/firebase';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { reset } from 'store/reducer';
export default function Logout() {
  const router = useRouter();
  const dispatch = useDispatch();
  const logOut = async () => {
    try {
      await signOut(auth);
      dispatch(reset());
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <button onClick={logOut}>logout</button>
    </>
  );
}
