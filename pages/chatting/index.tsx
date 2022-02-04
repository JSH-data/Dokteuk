import styled from '@emotion/styled';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { app } from '@firebase/firebase';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import Layout from '@layouts/Layout';

const Chatting = () => {
  const [myChats, setMyChats] = useState<ChatRoom[]>([]);

  useEffect(() => {
    const db = getFirestore(app);

    const chatQuery = query(
      collection(db, 'chatRoom'),
      where('users', 'array-contains', { nickName: 'User1', job: '직군' }),
    );

    onSnapshot(chatQuery, (querySnapshot) => {
      const newChat: ChatRoom[] = [];

      querySnapshot.forEach((result) => {
        const { users, lastChat, updateAt, lastVisited } = result.data();
        const other = users.find((me: Person) => me.nickName !== 'User1');
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
  }, []);

  return (
    <Layout>
      <div>
        {myChats.map(({ other, lastChat, updateAt, id }, idx) => (
          <Fragment key={id}>
            {idx !== 0 && <div></div>}
            <Link href={`/chatting/${id}`} passHref>
              <ChatWrapperDiv>
                <ChatInfo>
                  <div>{other.nickName}</div>
                  <ChatText>
                    {lastChat ? lastChat : '아직 나눈 대화가 없습니다.'}
                  </ChatText>
                </ChatInfo>
                <div>
                  <div>{`${updateAt.toDate().getMonth() + 1}월 ${updateAt
                    .toDate()
                    .getDate()}일`}</div>
                  <div></div>
                </div>
              </ChatWrapperDiv>
            </Link>
          </Fragment>
        ))}
      </div>
    </Layout>
  );
};
export default Chatting;

const ChatWrapperDiv = styled.div`
  display: flex;
  justify-content: space-between;
  width: 420px;
  height: 60px;
  margin: 10px auto;
  cursor: pointer;
`;

const ChatInfo = styled.div`
  width: 300px;
`;

const ChatText = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
