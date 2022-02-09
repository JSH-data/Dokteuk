import { Fragment, useEffect, useState } from 'react';
import { chatList } from '../api/chat';
import Link from 'next/link';
import styled from '@emotion/styled';
import Layout from '@layouts/Layout';
import { getAuth } from '@firebase/auth';
import { app } from '@firebase/firebase';

const Chatting = () => {
  const [myChats, setMyChats] = useState<ChatRoom[]>([]);

  useEffect(() => {
    const unsubscribe = chatList(setMyChats);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Layout>
      {myChats.map(({ other, last_chat, update_at, last_visited, id }, idx) => (
        <Fragment key={id}>
          {idx !== 0 && <Line />}
          <Link
            href={{
              pathname: `/chatting/${id}`,
              query: {
                other: other ? other.nickname : '대화방에 상대가 없습니다.',
              },
            }}
            as={`/chatting/${id}`}
            passHref
          >
            <ChatWrapperDiv>
              <ChatInfo>
                <div>
                  {other ? other.nickname : '대화방에 상대가 없습니다.'}
                </div>
                <ChatText>
                  {last_chat ? last_chat : '아직 나눈 대화가 없습니다.'}
                </ChatText>
              </ChatInfo>
              <div>
                <div>{`${update_at.toDate().getMonth() + 1}월 ${update_at
                  .toDate()
                  .getDate()}일`}</div>
                {last_visited['User1'] < update_at && <Notice />}
              </div>
            </ChatWrapperDiv>
          </Link>
        </Fragment>
      ))}
    </Layout>
  );
};
export default Chatting;

const ChatWrapperDiv = styled.div`
  display: flex;
  justify-content: space-between;
  width: clamp(0px, 80%, 680px);
  height: 60px;
  margin: 10px auto;
  cursor: pointer;
  & div {
    padding: 5px 0;
  }
`;

const ChatInfo = styled.div`
  width: 300px;
`;

const ChatText = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const Notice = styled.div`
  background: red;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  margin: 0 auto;
`;

const Line = styled.div`
  width: 80%;
  border-bottom: 1px solid #00000020;
  margin: 0 auto;
`;
