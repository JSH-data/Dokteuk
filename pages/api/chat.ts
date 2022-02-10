import { app } from '@firebase/firebase';
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  arrayRemove,
  Timestamp,
  startAfter,
  where,
  orderBy,
  query,
  limit,
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { Dispatch, SetStateAction } from 'react';

const db = getFirestore(app);
const storage = getStorage(app);

export const chatList = (setMyChats: Dispatch<SetStateAction<ChatRoom[]>>) => {
  const chatListQuery = query(
    collection(db, 'chat'),
    where('users', 'array-contains', { nickname: 'User1', job: '직군' }),
    orderBy('update_at', 'desc'),
    limit(20),
  );

  const unsubscribe = onSnapshot(chatListQuery, (querySnapshot) => {
    const newChat: ChatRoom[] = [];
    querySnapshot.forEach((result) => {
      const { users, last_chat, update_at, last_visited } = result.data();
      const other = users.find((me: Person) => me.nickname !== 'User1');
      newChat.push({
        id: result.id,
        other,
        last_chat,
        update_at,
        last_visited,
      });
    });
    setMyChats(newChat);
  });
  return unsubscribe;
};

export const chatMessages = (
  chatId: queryType,
  setMessages: Dispatch<SetStateAction<ChatText[]>>,
  setLastKey: Dispatch<SetStateAction<Timestamp | null>>,
) => {
  const chatQuery = query(
    collection(db, `chat/${chatId}/messages`),
    orderBy('create_at', 'desc'),
    limit(20),
  );

  const unsubscribe = onSnapshot(chatQuery, (querySnapshot) => {
    const newChat: ChatText[] = [];
    const lastKey =
      querySnapshot.docs.length === 20
        ? querySnapshot.docs[querySnapshot.docs.length - 1].data().create_at
        : null;

    querySnapshot.forEach((doc) => {
      const { msg, img, from, create_at } = doc.data();
      newChat.push({
        id: doc.id,
        from,
        msg,
        img,
        create_at,
      });
    });
    setMessages(newChat);
    setLastKey(lastKey);
  });
  return unsubscribe;
};

export const moreChatMessages = (
  chatId: queryType,
  setMessages: Dispatch<SetStateAction<ChatText[]>>,
  setLastKey: Dispatch<SetStateAction<Timestamp | null>>,
  key: Timestamp | null,
) => {
  const chatQuery = query(
    collection(db, `chat/${chatId}/messages`),
    orderBy('create_at', 'desc'),
    startAfter(key),
    limit(20),
  );

  onSnapshot(chatQuery, (querySnapshot) => {
    const newChat: ChatText[] = [];
    const lastKey =
      querySnapshot.docs.length === 20
        ? querySnapshot.docs[querySnapshot.docs.length - 1].data().create_at
        : null;

    querySnapshot.forEach((doc) => {
      const { msg, img, from, create_at } = doc.data();
      newChat.push({
        id: doc.id,
        from,
        msg,
        img,
        create_at,
      });
    });
    setMessages((current) => [...current, ...newChat]);
    setLastKey(lastKey);
  });
};

export const sendMessage = async (
  chatId: queryType,
  value: string,
  msgType: string,
  file?: Blob | ArrayBuffer,
) => {
  const message = await addDoc(collection(db, `chat/${chatId}/messages`), {
    from: 'User1',
    [msgType]: value,
    create_at: Timestamp.now(),
  });

  await updateDoc(doc(db, 'chat', chatId as string), {
    last_chat: msgType === 'msg' ? value : '사진을 보냈습니다.',
    update_at: Timestamp.now(),
    [`last_visited.${'User1'}`]: Timestamp.now(),
  });

  if (msgType === 'img') {
    uploadBytes(ref(storage, `chat/${message.id}`), file!).then(() => {
      console.log('Uploaded a IMG!');
    });
  }
};

export const downMessage = (key: string) => {
  getDownloadURL(ref(storage, `chat/${key}`)).then((url) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = () => {
      const blob = xhr.response;

      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = 'download';
      a.click();
    };
    xhr.open('GET', url);
    xhr.send();
  });
};

export const leaveChat = async (chatId: queryType) => {
  await updateDoc(doc(db, 'chat', chatId as string), {
    users: arrayRemove({ nickname: 'User2', job: '직군' }),
  });
};
