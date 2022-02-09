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
import { Dispatch, SetStateAction } from 'react';

const db = getFirestore(app);

export const chatList = (setMyChats: Dispatch<SetStateAction<ChatRoom[]>>) => {
  const chatListQuery = query(
    collection(db, 'chat'),
    where('users', 'array-contains', { nickname: 'User1', job: '직군' }),
    orderBy('update_at', 'desc'),
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
      const { msg, from, create_at } = doc.data();
      newChat.push({
        id: doc.id,
        from,
        msg,
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

  const unsubscribe = onSnapshot(chatQuery, (querySnapshot) => {
    const newChat: ChatText[] = [];
    const lastKey =
      querySnapshot.docs.length === 20
        ? querySnapshot.docs[querySnapshot.docs.length - 1].data().create_at
        : null;

    querySnapshot.forEach((doc) => {
      const { msg, from, create_at } = doc.data();
      newChat.push({
        id: doc.id,
        from,
        msg,
        create_at,
      });
    });
    setMessages((current) => [...current, ...newChat]);
    setLastKey(lastKey);
  });
  return unsubscribe;
};

export const sendMessage = async (chatId: queryType, value: string) => {
  await addDoc(collection(db, `chat/${chatId}/messages`), {
    from: 'User1',
    msg: value,
    create_at: Timestamp.now(),
  });

  await updateDoc(doc(db, 'chat', chatId as string), {
    last_chat: value,
    update_at: Timestamp.now(),
    [`last_visited.${'User1'}`]: Timestamp.now(),
  });
};

export const leaveChat = async (chatId: queryType) => {
  await updateDoc(doc(db, 'chat', chatId as string), {
    users: arrayRemove({ nickname: 'User2', job: '직군' }),
  });
};
