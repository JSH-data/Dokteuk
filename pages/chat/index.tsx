import { Fragment, useEffect, useMemo, useState } from 'react';
import { chatList } from '../api/chat';
import Link from 'next/link';
import Layout from '@layouts/Layout';
import wrapper from '@store/configureStore';
import {
  ChatMain,
  EmptyChatWrapper,
  ChatWrapper,
  Text,
  Notice,
} from '../../styles/chatStyle';

const Chat = ({ user }: { user: UserType }) => {
  const [myChats, setMyChats] = useState<ChatRoom[]>([]);
  useEffect(() => {
    const unsubscribe = chatList(setMyChats, user);

    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    <Layout>
      <ChatMain>
        {myChats.length === 0 ? (
          <EmptyChatWrapper>
            <div>아직 개설된 채팅방이 없습니다.</div>
          </EmptyChatWrapper>
        ) : (
          myChats.map(({ other, lastChat, updateAt, lastVisited, id }) => (
            <Fragment key={id}>
              <Link
                href={{
                  pathname: `/chat/${id}`,
                  query: {
                    other: other ? other.nickname : '대화방에 상대가 없습니다.',
                  },
                }}
                as={`/chat/${id}`}
                passHref
              >
                <ChatWrapper>
                  <div className="text">
                    <div className="userInfo">
                      {other ? (
                        <>
                          <div>{other.nickname}</div>
                          <div className="job">{other.job}</div>
                        </>
                      ) : (
                        '대화방에 상대가 없습니다.'
                      )}
                    </div>
                    <Text>
                      {lastChat ? lastChat : '아직 나눈 대화가 없습니다.'}
                    </Text>
                  </div>
                  <div>
                    <div>{`${updateAt.toDate().getMonth() + 1}월 ${updateAt
                      .toDate()
                      .getDate()}일`}</div>
                    <Notice isRead={lastVisited[user.id] >= updateAt} />
                  </div>
                </ChatWrapper>
              </Link>
            </Fragment>
          ))
        )}
      </ChatMain>
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const data = store.getState();
    console.log(data, '마이페이지 데이터');
    if (data.user.user.nickname == '') {
      return {
        redirect: {
          destination: '/user/login',
          permanent: false,
        },
      };
    }

    return {
      props: {
        user: {
          nickname: data.user.user.nickname,
          job: data.user.user.jobSector,
          id: data.user.user.id,
        },
      },
    };
  },
);

export default Chat;
