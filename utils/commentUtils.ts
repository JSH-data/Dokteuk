import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@firebase/firebase';
import setCurrentDate from './setCurrentDate';

export const addOriginComment = async (
  content: string,
  currentDate: string,
  postId: string,
  bundleId?: number,
) => {
  await addDoc(collection(db, 'comment'), {
    text: content,
    likes: 0,
    pressedPerson: [],
    nickname: '닉네임입니다',
    job: '직군',
    userId: 'user',
    postId: postId,
    bundleId: bundleId,
    bundleOrder: bundleId,
    createdAt: currentDate,
    updatedAt: '',
    deletedAt: '',
    isDeleted: false,
    origin: true,
  });
};

export const addNestedComment = async (
  content: string,
  bundleId: number,
  currentDate: string,
  detailTimeStamp: number,
  postId: string,
) => {
  await addDoc(collection(db, 'comment'), {
    text: content,
    likes: 0,
    pressedPerson: [],
    nickname: '닉네임입니다',
    job: '직군',
    userId: 'user',
    postId: postId,
    bundleId: bundleId,
    bundleOrder: detailTimeStamp,
    createdAt: currentDate,
    updatedAt: '',
    deletedAt: '',
    isDeleted: false,
    origin: false,
  });
};

export const updateComment = async (
  content: string,
  id: string,
  timeStamp: Date,
) => {
  const commentRef = doc(db, 'comment', id);
  const currentDate = setCurrentDate(timeStamp);
  await updateDoc(commentRef, {
    text: content,
    updatedAt: currentDate,
  });
};
