import { Fragment, useCallback, useEffect, useState } from 'react';
import { chatList, updateNotification } from '../api/chat';
import { getDateTime } from '../../utils/function';
import Link from 'next/link';
import Layout from '@layouts/Layout';
import wrapper from '@store/configureStore';
import Empty from '@components/Empty';
import { ChatMain, ChatWrapper, Text, Notice } from '../../styles/chatStyle';

const Chat = ({ user }: { user: Person }) => {
  const [myChats, setMyChats] = useState<ChatRoom[]>([]);

  const checkNotification = useCallback(() => {
    return myChats.find((chat) => chat.lastVisited[user.id] < chat.updateAt);
  }, [myChats, user.id]);

  useEffect(() => {
    if (checkNotification()) {
      updateNotification(user.id, true);
    } else {
      updateNotification(user.id, false);
    }
  }, [checkNotification, user.id, user]);

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
          <Empty ment="아직 개설된 채팅방이 없습니다." />
        ) : (
          myChats.map(({ other, lastChat, updateAt, lastVisited, id }) => (
            <Fragment key={id}>
              <Link
                href={{
                  pathname: `/chat/${id}`,
                  query: {
                    other: other ? other.nickname : '대화방에 상대가 없습니다.',
                    id: other ? other.id : null,
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
                          <div className="job">{other.jobSector}</div>
                        </>
                      ) : (
                        '대화방에 상대가 없습니다.'
                      )}
                    </div>
                    <Text>{lastChat}</Text>
                  </div>
                  <div>
                    <div>
                      {getDateTime((updateAt.seconds * 1000).toString())}
                    </div>
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
  (store) => async () => {
    const data = store.getState();

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
          jobSector: data.user.user.jobSector,
          id: data.user.user.id,
        },
      },
    };
  },
);

export default Chat;
