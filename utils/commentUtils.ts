import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@firebase/firebase';
import setCurrentDate from './setCurrentDate';

export const addOriginComment = async (
  content: string,
  postId: string,
  userInfo: any,
  bundleId?: number,
) => {
  // console.log(userInfo, 'userInfo');
  // console.log({
  //   text: content,
  //   likes: 0,
  //   pressedPerson: [],
  //   nickname: userInfo.nickname,
  //   job: userInfo.jobSector,
  //   userId: userInfo.id,
  //   postId: postId,
  //   bundleId: bundleId,
  //   bundleOrder: bundleId,
  //   createdAt: currentDate,
  //   updatedAt: '',
  //   deletedAt: '',
  //   isDeleted: false,
  //   origin: true,
  // });
  try {
    await addDoc(collection(db, 'comment'), {
      text: content,
      likes: 0,
      pressedPerson: [],
      nickname: userInfo.nickname,
      job: userInfo.jobSector,
      userId: userInfo.id,
      postId: postId,
      bundleId: bundleId,
      bundleOrder: bundleId,
      createdAt: Date.now().toString(),
      updatedAt: '',
      deletedAt: '',
      isDeleted: false,
      origin: true,
    });
  } catch (err) {
    alert(`${err}`);
  }
};

export const addNestedComment = async (
  content: string,
  bundleId: number,

  detailTimeStamp: number,
  userInfo: any,
  postId: string,
) => {
  await addDoc(collection(db, 'comment'), {
    text: content,
    likes: 0,
    pressedPerson: [],
    nickname: userInfo.nickname,
    job: userInfo.jobSector,
    userId: userInfo.id,
    postId: postId,
    bundleId: bundleId,
    bundleOrder: detailTimeStamp,
    createdAt: Date.now().toString(),
    updatedAt: '',
    deletedAt: '',
    isDeleted: false,
    origin: false,
  });
};

export const updateComment = async (
  content: string,
  commentId: string,
  timeStamp: Date,
) => {
  const commentRef = doc(db, 'comment', commentId);
  const currentDate = setCurrentDate(timeStamp);
  await updateDoc(commentRef, {
    text: content,
    updatedAt: currentDate,
  });
};
