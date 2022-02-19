import {
  addDoc,
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from '@firebase/firebase';

export interface ChatDefault {
  nickname: string;
  id: string;
  jobSector: string;
}

interface alreadyChatType {
  id: string | null;
  counterInfo: undefined | ChatDefault;
}

export const createChatRoom = async (
  myInfo: ChatDefault,
  counterInfo: ChatDefault,
) => {
  const chatQuery = query(
    collection(db, `chat`),
    where(`userValid.${myInfo.id}`, '==', true),
    where(`userValid.${counterInfo.id}`, '==', true),
  );

  const querySnapshot = await getDocs(chatQuery);

  let alreadyChat: alreadyChatType = {
    id: null,
    counterInfo: undefined,
  };

  querySnapshot.forEach((data) => {
    const { users } = data.data();
    alreadyChat.id = data.id;
    alreadyChat.counterInfo = users.find(
      (user: ChatDefault) =>
        user.id === counterInfo.id && user.nickname === counterInfo.nickname,
    );
  });

  if (alreadyChat.id && alreadyChat.counterInfo) {
    return alreadyChat.id;
  } else {
    const { id } = await addDoc(collection(db, 'chat'), {
      users: [
        {
          nickname: myInfo.nickname,
          id: myInfo.id,
          jobSector: myInfo.jobSector,
        },
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
      userValid: {
        [myInfo.id]: true,
        [counterInfo.id]: true,
      },
    });
    return id;
  }
};
