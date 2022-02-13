import {
  collection,
  getDoc,
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
  getDocs,
  endBefore,
} from 'firebase/firestore';
import { db, storage } from '../../firebase/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Dispatch, SetStateAction } from 'react';

export const chatList = (
  setMyChats: Dispatch<SetStateAction<ChatRoom[]>>,
  user: UserType,
) => {
  const chatListQuery = query(
    collection(db, 'chat'),
    where('users', 'array-contains', user),
    orderBy('update_at', 'desc'),
    limit(20),
  );

  const unsubscribe = onSnapshot(chatListQuery, (querySnapshot) => {
    const newChat: ChatRoom[] = [];
    querySnapshot.forEach((result) => {
      const { users, last_chat, update_at, last_visited } = result.data();
      const other = users.find((me: Person) => me.nickname !== user.nickname);
      newChat.push({
        id: result.id,
        other,
        last_chat,
        update_at,
        last_visited,
        user,
      });
    });
    setMyChats(newChat);
  });
  return unsubscribe;
};

export const getChatMessages = async (chatId: queryType, user: UserType) => {
  const chatQuery = query(
    collection(db, `chat/${chatId}/messages`),
    orderBy('create_at', 'desc'),
    limit(20),
  );

  const querySnapshot = await getDocs(chatQuery);

  const initMessage: ChatText[] = [];
  const startKey =
    querySnapshot.docs.length === 20
      ? querySnapshot.docs[querySnapshot.docs.length - 1].data().create_at
      : null;
  const endKey = querySnapshot.docs[0].data().create_at;

  querySnapshot.forEach((doc) => {
    const { msg, img, from, create_at } = doc.data();
    initMessage.push({
      id: doc.id,
      from,
      msg,
      img,
      create_at,
      user,
    });
  });

  return {
    initMessage,
    _startKey: startKey,
    _endKey: endKey,
  };
};

export const chatMessages = (
  chatId: queryType,
  setMessages: Dispatch<SetStateAction<ChatText[]>>,
  key: Timestamp | null,
  user: UserType,
) => {
  const chatQuery = query(
    collection(db, `chat/${chatId}/messages`),
    orderBy('create_at', 'desc'),
    endBefore(key),
    limit(1),
  );

  onSnapshot(chatQuery, (querySnapshot) => {
    const newChat: ChatText[] = [];
    querySnapshot.forEach((doc) => {
      const { msg, img, from, create_at } = doc.data();
      newChat.push({
        id: doc.id,
        from,
        msg,
        img,
        create_at,
        user,
      });
    });
    setMessages((current) => [...newChat, ...current]);
  });
};

export const moreChatMessages = async (
  chatId: queryType,
  key: Timestamp | null,
  user: UserType,
) => {
  const chatQuery = query(
    collection(db, `chat/${chatId}/messages`),
    orderBy('create_at', 'desc'),
    startAfter(key),
    limit(20),
  );

  const querySnapshot = await getDocs(chatQuery);

  const moreMessage: ChatText[] = [];
  const startKey =
    querySnapshot.docs.length === 20
      ? querySnapshot.docs[querySnapshot.docs.length - 1].data().create_at
      : null;

  querySnapshot.forEach((doc) => {
    const { msg, img, from, create_at } = doc.data();
    moreMessage.push({
      id: doc.id,
      from,
      msg,
      img,
      create_at,
      user,
    });
  });
  return {
    moreMessage,
    _startKey: startKey,
  };
};

export const sendMessage = async (
  chatId: queryType,
  value: string,
  msgType: string,
  user: UserType,
  file?: Blob | ArrayBuffer,
) => {
  const timestamp = Timestamp.now();

  const message = await addDoc(collection(db, `chat/${chatId}/messages`), {
    from: user.nickname,
    [msgType]: value,
    create_at: timestamp,
  });

  await updateDoc(doc(db, 'chat', chatId as string), {
    last_chat: msgType === 'msg' ? value : '사진을 보냈습니다.',
    update_at: timestamp,
    [`last_visited.${user.nickname}`]: timestamp,
  });

  if (msgType === 'img' && file) {
    uploadImg(message.id, file);
  }
};

export const uploadImg = (id: string, file: Blob | ArrayBuffer) => {
  uploadBytes(ref(storage, `chat/${id}`), file).then(() => {
    console.log('Uploaded a IMG!');
  });
};

export const downloadImg = (key: string) => {
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

export const leaveChat = async (chatId: queryType, user: UserType) => {
  await updateDoc(doc(db, 'chat', chatId as string), {
    [`last_visited.${user.nickname}`]: Timestamp.now(),
  });
};

export const exitChat = async (chatId: queryType, user: UserType) => {
  const chatRoom = await getDoc(doc(db, 'chat', chatId as string));
  const other = chatRoom
    .data()!
    .users.find((me: any) => me.nickname !== user.nickname);

  await updateDoc(doc(db, 'chat', chatId as string), {
    users: arrayRemove(other),
  });
};
