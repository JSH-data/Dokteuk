import React from 'react';

import { signOut } from 'firebase/auth';
import { auth } from '@firebase/firebase';
import { useRouter } from 'next/router';
export default function Logout() {
  const router = useRouter();
  const logOut = async () => {
    await signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log('log out');
        router.push('/');
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };
  return (
    <>
      <button onClick={logOut}>logout</button>
    </>
  );
}
