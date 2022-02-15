import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@firebase/firebase';

export interface ChatDefault {
  nickname: string;
  id: string;
  jobSector: string;
}

export const createChatRoom = async (
  myInfo: ChatDefault,
  counterInfo: ChatDefault,
) => {
  const { id } = await addDoc(collection(db, 'chat'), {
    users: [
      { nickname: myInfo.nickname, id: myInfo.id, jobSector: myInfo.jobSector },
      {
        nickname: counterInfo.nickname,
        id: counterInfo.id,
        jobSector: counterInfo.jobSector,
      },
    ],
    lastVisited: {
      [myInfo.id]: Timestamp.now(),
      [counterInfo.id]: Timestamp.now(),
    },
    userIds: [myInfo.id],
  });

  return id;
};
