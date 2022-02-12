import { Fragment, useEffect, useMemo, useState } from 'react';
import { chatList } from '../api/chat';
import Link from 'next/link';
import styled from '@emotion/styled';
import Layout from '@layouts/Layout';
import wrapper from '@store/configureStore';

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
                      <div>
                        {other ? other.nickname : '대화방에 상대가 없습니다.'}
                      </div>
                      <ChatText>
                        {last_chat ? last_chat : '아직 나눈 대화가 없습니다.'}
                      </ChatText>
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

const ChatMain = styled.div`
  height: calc(100vh - 120px);
  overflow: scroll;
`;
const EmptyChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: clamp(0px, 80%, 680px);
  height: calc(100% - 40px);
  text-align: center;
  margin: 20px auto;
  border-radius: 10px;
  background: ${({ theme }: any) =>
    theme.customTheme.defaultMode.cardWrapperBackgroundColor};

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) =>
      theme.customTheme.darkMode.cardWrapperBackgroundColor};
  }
`;

const ChatWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: clamp(0px, 80%, 680px);
  height: 80px;
  margin: 20px auto;
  padding: 0 20px;
  cursor: pointer;
  border-radius: 10px;
  background: ${({ theme }: any) =>
    theme.customTheme.defaultMode.cardWrapperBackgroundColor};
  & > div {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  & .text {
    width: clamp(0px, 75%, 450px);
  }

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) =>
      theme.customTheme.darkMode.cardWrapperBackgroundColor};
  }
`;

const ChatText = styled.div`
  padding-left: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const Notice = styled.div<NoticeProps>`
  background: ${(props) => (props.isRead ? 'none' : 'red')};
  height: 20px;
  width: 20px;
  border-radius: 50%;
  margin: 0 auto;
`;
