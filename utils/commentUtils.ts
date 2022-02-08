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
    pressed_person: [],
    nickname: '닉네임입니다',
    job: '직군',
    user_id: 'user',
    post_id: postId,
    bundle_id: bundleId,
    bundle_order: bundleId,
    created_at: currentDate,
    updated_at: '',
    deleted_at: '',
    is_deleted: false,
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
    pressed_person: [],
    nickname: '닉네임입니다',
    job: '직군',
    user_id: 'user',
    post_id: postId,
    bundle_id: bundleId,
    bundle_order: detailTimeStamp,
    created_at: currentDate,
    updated_at: '',
    deleted_at: '',
    is_deleted: false,
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
    updated_at: currentDate,
  });
};
