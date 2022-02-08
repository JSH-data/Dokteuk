import styled from '@emotion/styled';
import MoodBadIcon from '@mui/icons-material/MoodBad';
// import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@layouts/Layout';
import { getMyInfo } from '@utils/function';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { MyChatting, UserState } from '@interface/StoreInterface';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from 'store/reducer';
const ChattingPageWrapperDiv = styled.div`
  background-color: rgba(28, 28, 30, 1);
  color: rgb(81, 81, 83);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
  width: 100%;
  border-top: solid 1px rgb(59, 59, 61);
  border-bottom: solid 1px rgb(59, 59, 61);
  margin-bottom: 60px;
`;
const ChattingHeaderMenuWrapperDivStyled = styled.div`
  width: 100%;
  height: 42px;
  border-bottom: solid 1px rgb(59, 59, 61);
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  text-align: center;
  & .my-chatting {
    cursor: pointer;
  }
  & .public-chatting {
    cursor: pointer;
  }
  ${({ property }) =>
    property === 'my'
      ? '& .my-chatting{color:#fff}'
      : '& .public-chatting{color:#fff}'}
`;
const DividerStyled = styled.div`
  width: 100%;
  border-radius: 10px;
  margin-top: -1px;
  margin-right: auto;
  display: flex;
  & div.divider-center {
    height: 2px;
    background-color: #fff;
    width: 50%;
  }
  & div.divider-start {
    transition: 0.5s;
    width: ${({ property }) => (property === 'public' ? '50%' : 0)};
  }
  & div.divider-end {
    transition: 0.5s;
    width: ${({ property }) => (property === 'public' ? 0 : '50%')};
  }
`;

const Chatting = () => {
  const [chatMode, setChatMode] = useState('my');
  const { user: myInfo }: any = useSelector((state: UserState) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!myInfo) dispatch(getUser());
  }, [myInfo, dispatch]);
  return (
    <Layout>
      <ChattingPageWrapperDiv>
        <ChattingHeaderMenuWrapperDivStyled property={chatMode}>
          <div
            className={`my-chatting ${chatMode}`}
            onClick={() => {
              setChatMode('my');
            }}
          >
            MY
          </div>
          <div
            className={`public-chatting ${chatMode}`}
            onClick={() => {
              setChatMode('public');
            }}
          >
            퍼블릭
          </div>
        </ChattingHeaderMenuWrapperDivStyled>
        <DividerStyled property={chatMode}>
          <div className="divider-start" />
          <div className="divider-center" />
          <div className="divider-end" />
        </DividerStyled>
        {myInfo ? (
          <>
            {chatMode === 'my' && (
              <>
                {myInfo.myChattings?.length > 0 ? (
                  <div>
                    {myInfo.myChattings.map((chat: MyChatting) => (
                      <div
                        key={chat.roomId}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        {chat.isGroup ? (
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                            }}
                          >
                            <EmojiEmotionsIcon
                              style={{ color: 'rgb(114,125,147)' }}
                            />
                            <EmojiEmotionsIcon
                              style={{ color: 'rgb(129,198,205)' }}
                            />
                            <EmojiEmotionsIcon
                              style={{ color: 'rgb(161,163,212)' }}
                            />
                            <EmojiEmotionsIcon
                              style={{ color: 'rgb(228,242,132)' }}
                            />
                          </div>
                        ) : (
                          <div>
                            <EmojiEmotionsIcon />
                          </div>
                        )}
                        <div>{chat.roomName}</div>
                        <div>{chat.lastMessage.content}</div>
                        <div>{chat.unreadCount}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      height: 'calc(100vh - 166px)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div>
                      <MoodBadIcon fontSize="large" />
                    </div>
                    <div>대화 내역이 없습니다.</div>
                  </div>
                )}
              </>
            )}
            {chatMode === 'public' && (
              <div>
                {new Array(100).fill(0).map((v, i) => (
                  <div key={i}>채팅1</div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ height: 'calc(100vh - 166px)' }}>
            <div
              style={{
                position: 'relative',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              로그인 후 이용해주세요
            </div>
          </div>
        )}
      </ChattingPageWrapperDiv>
    </Layout>
  );
};
export default Chatting;
