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

const Chat = ({ nickname, job }: { nickname: string; job: string }) => {
  const [myChats, setMyChats] = useState<ChatRoom[]>([]);
  const user = useMemo(() => ({ nickname, job }), [nickname, job]);

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
          myChats.map(
            ({ other, last_chat, update_at, last_visited, id, user }) => (
              <Fragment key={id}>
                <Link
                  href={{
                    pathname: `/chat/${id}`,
                    query: {
                      other: other
                        ? other.nickname
                        : '대화방에 상대가 없습니다.',
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
                        {last_chat ? last_chat : '아직 나눈 대화가 없습니다.'}
                      </Text>
                    </div>
                    <div>
                      <div>{`${update_at.toDate().getMonth() + 1}월 ${update_at
                        .toDate()
                        .getDate()}일`}</div>
                      <Notice
                        isRead={last_visited[user!.nickname] >= update_at}
                      />
                    </div>
                  </ChatWrapper>
                </Link>
              </Fragment>
            ),
          )
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
      // todo: 초기값을 판단하는 근거가 이상함...
      return {
        redirect: {
          destination: '/404',
          permanent: false,
        },
      };
    }

    return {
      props: {
        nickname: data.user.user.nickname,
        job: data.user.user.jobSector,
      },
    };
  },
);

export default Chat;
