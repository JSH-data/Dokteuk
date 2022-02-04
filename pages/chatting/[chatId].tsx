import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { app } from '@firebase/firebase';
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  Timestamp,
  orderBy,
  query,
  limit,
} from 'firebase/firestore';
import styled from '@emotion/styled';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';

const ChatRoom = () => {
  const db = getFirestore(app);
  const [messages, setMessages] = useState<ChatText[]>([]);
  const inputValue = useRef<HTMLInputElement>(null);
  const bottomListRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { chatId } = router.query;

  useEffect(() => {
    const chatQuery = query(
      collection(db, `chatRoom/${chatId}/messages`),
      orderBy('createAt'),
      limit(20),
    );

    onSnapshot(chatQuery, (querySnapshot) => {
      const newChat: ChatText[] = [];

      querySnapshot.forEach((doc) => {
        const { msg, user, createAt } = doc.data();
        newChat.push({
          id: doc.id,
          user,
          msg,
          createAt,
        });
      });
      setMessages(newChat);
    });
  }, [chatId, db]);

  useEffect(() => {
    bottomListRef.current!.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    await addDoc(collection(db, `chatRoom/${chatId}/messages`), {
      user: 'User1',
      msg: inputValue.current!.value,
      createAt: Timestamp.now(),
    });

    await updateDoc(doc(db, 'chatRoom', chatId), {
      lastChat: inputValue.current!.value,
      updateAt: Timestamp.now(),
    });

    inputValue.current!.value = '';
  };

  return (
    <div>
      <ChatHeader>
        <ArrowBackIosNewIcon
          onClick={() => router.back()}
          style={{ cursor: 'pointer' }}
        />
        <div>User1</div>
        <DensityMediumIcon />
      </ChatHeader>
      <ChatList>
        <ChatBox>
          {messages.map(({ id, user, msg }) => (
            <ChatText className={user === 'User2' ? 'mine' : ''} key={id}>
              {msg}
            </ChatText>
          ))}
          <div ref={bottomListRef} />
        </ChatBox>
      </ChatList>
      <ChatInputWrapper>
        <AddIcon style={{ cursor: 'pointer' }} />
        <InputBox
          ref={inputValue}
          placeholder="메세지를 입력해주세요."
          required
        />
        <SendIcon
          style={{ position: 'absolute', right: '40px', cursor: 'pointer' }}
          onClick={sendMessage}
        />
      </ChatInputWrapper>
    </div>
  );
};

export default ChatRoom;

const ChatHeader = styled.div`
  position: fixed;
  width: 100vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background: #8946a6;
  padding: 0 20px;
`;

const ChatList = styled.div`
  padding-top: 60px;
  height: calc(100vh - 60px);
  overflow: scroll;
`;

const ChatBox = styled.ul`
  padding: 30px;
  margin: 0;
  color: black;
`;

const ChatText = styled.li`
  list-style: none;
  background: #f0f0f0;
  padding: 20px;
  width: 50%;
  height: 60px;
  margin: 15px 0;
  border-radius: 20px;
  &.mine {
    background: #b762c1;
    margin-left: auto;
  }
`;

const ChatInputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background: #8946a6;
  padding: 0 20px;
`;

const InputBox = styled.input`
  border-radius: 20px;
  border: none;
  width: 100%;
  height: 40px;
  margin-left: 20px;
  padding-left: 30px;
  padding-right: 60px;
  background: #f2f2f2;
  &:focus {
    outline: none;
  }
  &:not(:valid) {
    & + svg {
      display: none;
    }
  }
`;
