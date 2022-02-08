import { useRouter } from 'next/router';
import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import {
  sendMessage,
  chatMessages,
  moreChatMessages,
  leaveChat,
} from '../api/chat';
import styled from '@emotion/styled';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import { Timestamp } from 'firebase/firestore';
import ImgPreviewModal from '@components/ImgPreviewModal';
import ChatSetting from '@components/ChatSetting';

const ChatRoom = () => {
  const [messages, setMessages] = useState<ChatText[]>([]);
  const [lastKey, setLastKey] = useState<Timestamp | null>(null);
  const [fileSrc, setFileSrc] = useState<String | ArrayBuffer | null>(null);
  const [isClickedHeader, setIsClickedHeader] = useState<boolean>(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
  });
  const inputValue = useRef<HTMLInputElement>(null);
  const bottomListRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { chatId, other } = router.query;

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const theFile = files![0];
    const reader = new FileReader();

    reader.onload = () => {
      const { result } = reader;
      setFileSrc(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onFileReset = () => {
    setFileSrc(null);
  };

  const onToggle = () => {
    setIsClickedHeader(!isClickedHeader);
  };

  const onLeaveChat = () => {
    leaveChat(chatId);
    router.replace(`/chatting`);
  };

  useEffect(() => {
    const unsubscribe = chatMessages(chatId, setMessages, setLastKey);

    return () => {
      unsubscribe();
    };
  }, [chatId]);

  useEffect(() => {
    if (lastKey) {
      bottomListRef.current!.scrollIntoView({ behavior: 'smooth' });
    } else {
      bottomListRef.current!.scrollIntoView();
    }
  }, [messages, lastKey]);

  useEffect(() => {
    if (inView && lastKey) {
      moreChatMessages(chatId, setMessages, setLastKey, lastKey);
    }
  }, [inView, chatId, lastKey]);

  return (
    <Fragment>
      {fileSrc && (
        <ImgPreviewModal fileSrc={fileSrc} onFileReset={onFileReset} />
      )}
      {isClickedHeader && (
        <ChatSetting onToggle={onToggle} onLeaveChat={onLeaveChat} />
      )}
      <ChatHeader>
        <ArrowBackIosNewIcon
          onClick={() => router.back()}
          style={{ cursor: 'pointer' }}
        />
        <div>{other}</div>
        <DensityMediumIcon onClick={onToggle} />
      </ChatHeader>
      <ChatList>
        <ChatBox>
          {messages
            .slice()
            .reverse()
            .map(({ id, from, msg }, idx) =>
              idx === 0 ? (
                <ChatText
                  className={from === 'User1' ? 'mine' : ''}
                  key={id}
                  ref={ref}
                >
                  {msg}
                </ChatText>
              ) : (
                <ChatText className={from === 'User1' ? 'mine' : ''} key={id}>
                  {msg}
                </ChatText>
              ),
            )}
          <div ref={bottomListRef} />
        </ChatBox>
      </ChatList>
      <ChatInputWrapper>
        <label htmlFor="file">
          <AddIcon style={{ cursor: 'pointer' }} />
        </label>
        <input id="file" type="file" hidden onChange={onFileChange} />
        <InputBox
          ref={inputValue}
          placeholder="메세지를 입력해주세요."
          required
        />
        <SendIcon
          style={{ position: 'absolute', right: '40px', cursor: 'pointer' }}
          onClick={() => {
            sendMessage(chatId, inputValue.current!.value);
            inputValue.current!.value = '';
          }}
        />
      </ChatInputWrapper>
    </Fragment>
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
  background: ${({ theme }: any) =>
    theme.customTheme.defaultMode.headerMenuBackgroundColor};
  padding: 0 20px;

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) =>
      theme.customTheme.darkMode.headerMenuBackgroundColor};
  }
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
  color: ${({ theme }: any) =>
    theme.customTheme.defaultMode.searchInputTextColor};
  list-style: none;
  background: #f0f0f0;
  padding: 20px;
  width: 50%;
  min-height: 60px;
  margin: 15px 0;
  border-radius: 20px;
  box-shadow: 0px 1px 1px 0 #00000036;
  &.mine {
    background: #b762c1;
    margin-left: auto;
  }

  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

const ChatInputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background: ${({ theme }: any) =>
    theme.customTheme.defaultMode.footerMenuBackgroundColor};
  padding: 0 20px;

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) =>
      theme.customTheme.darkMode.footerMenuBackgroundColor};
  }
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
