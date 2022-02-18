import {
  getAuth,
  updatePassword,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import { db } from '@firebase/firebase';
import { auth } from '@firebase/firebase';

import {
  doc,
  updateDoc,
  collection,
  where,
  query,
  getDocs,
} from 'firebase/firestore';

export const checkNickname = async (nickname: string) => {
  const nicknameCheckQuery = query(
    collection(db, 'user'),
    where('nickname', '==', nickname),
  );
  const nicknameCheckSnap = await getDocs(nicknameCheckQuery);
  if (nicknameCheckSnap.docs.length !== 0) {
    return true;
  } else {
    return false;
  }
};

export const nicknameUpdate = async (newNickname: string, userId: string) => {
  const userRef = doc(db, 'user', userId);
  await updateDoc(userRef, {
    nickname: newNickname,
  });
};

export const passwordUpdate = async (newPassword: string) => {
  const user = getAuth().currentUser;
  if (user) {
    const test = await updatePassword(user, newPassword)
      .then(() => 'true')
      .catch((err) => err.message);
    return test;
  }
  return 'false';
};

export const emailVerify = () => {
  const user = getAuth().currentUser;
  if (user) sendEmailVerification(user);
};

export const logOut = async () => {
  await signOut(auth)
    .then(() => {
      console.log('log out');
    })
    .catch((error) => {
      console.log(error);
    });
};
