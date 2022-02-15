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
  arrayUnion,
  deleteDoc,
} from 'firebase/firestore';
import { db, storage } from '../../firebase/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Dispatch, SetStateAction } from 'react';

export const chatList = (
  setMyChats: Dispatch<SetStateAction<ChatRoom[]>>,
  user: Person,
) => {
  const chatListQuery = query(
    collection(db, 'chat'),
    where('userIds', 'array-contains', user.id),
    orderBy('updateAt', 'desc'),
    limit(20),
  );

  const unsubscribe = onSnapshot(chatListQuery, (querySnapshot) => {
    const newChat: ChatRoom[] = [];
    querySnapshot.forEach((result) => {
      const { userIds, users, lastChat, updateAt, lastVisited } = result.data();
      const otherId = userIds.find((me: string) => me !== user.id);
      const other = users.find((person: Person) => person.id === otherId);
      newChat.push({
        id: result.id,
        other,
        lastChat,
        updateAt,
        lastVisited,
      });
    });
    setMyChats(newChat);
  });
  return unsubscribe;
};

export const getChatMessages = async (chatId: queryType) => {
  const chatQuery = query(
    collection(db, `chat/${chatId}/messages`),
    orderBy('createAt', 'desc'),
    limit(20),
  );

  const querySnapshot = await getDocs(chatQuery);

  const initMessage: ChatText[] = [];
  const startKey =
    querySnapshot.docs.length === 20
      ? querySnapshot.docs[querySnapshot.docs.length - 1].data().createAt
      : null;
  const endKey =
    querySnapshot.docs.length > 0
      ? querySnapshot.docs[0].data().createAt
      : null;

  querySnapshot.forEach((doc) => {
    const { msg, img, from, createAt } = doc.data();
    initMessage.push({
      id: doc.id,
      from,
      msg,
      img,
      createAt,
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
) => {
  let chatQuery;

  if (key) {
    chatQuery = query(
      collection(db, `chat/${chatId}/messages`),
      orderBy('createAt', 'desc'),
      endBefore(key),
      limit(1),
    );
  } else {
    chatQuery = query(
      collection(db, `chat/${chatId}/messages`),
      orderBy('createAt', 'desc'),
      limit(1),
    );
  }

  onSnapshot(chatQuery, (querySnapshot) => {
    const newChat: ChatText[] = [];
    querySnapshot.forEach((doc) => {
      const { msg, img, from, createAt } = doc.data();
      newChat.push({
        id: doc.id,
        from,
        msg,
        img,
        createAt,
      });
    });
    setMessages((current) => [...newChat, ...current]);
  });
};

export const moreChatMessages = async (
  chatId: queryType,
  key: Timestamp | null,
) => {
  const chatQuery = query(
    collection(db, `chat/${chatId}/messages`),
    orderBy('createAt', 'desc'),
    startAfter(key),
    limit(20),
  );

  const querySnapshot = await getDocs(chatQuery);

  const moreMessage: ChatText[] = [];
  const startKey =
    querySnapshot.docs.length === 20
      ? querySnapshot.docs[querySnapshot.docs.length - 1].data().createAt
      : null;

  querySnapshot.forEach((doc) => {
    const { msg, img, from, createAt } = doc.data();
    moreMessage.push({
      id: doc.id,
      from,
      msg,
      img,
      createAt,
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
  user: string,
  file?: Blob | ArrayBuffer,
  id?: queryType,
) => {
  const timestamp = Timestamp.now();

  const message = await addDoc(collection(db, `chat/${chatId}/messages`), {
    from: user,
    [msgType]: value,
    createAt: timestamp,
  });

  if (id) {
    await updateDoc(doc(db, 'chat', chatId as string), {
      lastChat: msgType === 'msg' ? value : '사진을 보냈습니다.',
      updateAt: timestamp,
      [`lastVisited.${user}`]: timestamp,
      userIds: arrayUnion(id),
    });
  } else {
    await updateDoc(doc(db, 'chat', chatId as string), {
      lastChat: msgType === 'msg' ? value : '사진을 보냈습니다.',
      updateAt: timestamp,
      [`lastVisited.${user}`]: timestamp,
    });
  }

  if (msgType === 'img' && file) {
    uploadBytes(ref(storage, `chat/${message.id}`), file).then(() => {
      console.log('Uploaded a IMG!');
    });
  }
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

export const leaveChat = async (chatId: queryType, user: string) => {
  await updateDoc(doc(db, 'chat', chatId as string), {
    [`lastVisited.${user}`]: Timestamp.now(),
  });
};

export const exitChat = async (chatId: queryType, user: String) => {
  await updateDoc(doc(db, 'chat', chatId as string), {
    userIds: arrayRemove(user),
  });
};
