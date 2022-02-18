import { getStorage, ref, uploadString } from 'firebase/storage';
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@firebase/firebase';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { reset } from 'store/reducer';

export const uploadImg = async (
  uid: string,
  imageExt: string,
  imageUrl: string,
) => {
  const storage = getStorage();
  const imageName = `${uid}.${imageExt}`;
  const imgRef = ref(storage, 'users/' + imageName);
  try {
    await uploadString(imgRef, imageUrl, 'data_url');
  } catch (e: any) {
    console.error(e);
  }
};
