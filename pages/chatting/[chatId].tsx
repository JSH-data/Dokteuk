import { useRouter } from 'next/router';
import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import {
  sendMessage,
  chatMessages,
  moreChatMessages,
  leaveChat,
  downMessage,
} from '../api/chat';
import { Timestamp } from 'firebase/firestore';
import { isValidType } from '../../utils/upload';
import ImgPreviewModal from '@components/ImgPreviewModal';
import ChatSetting from '@components/ChatSetting';
import styled from '@emotion/styled';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';

const ChatRoom = () => {
  const [messages, setMessages] = useState<ChatText[]>([]);
  const [lastKey, setLastKey] = useState<Timestamp | null>(null);
  const [fileSrc, setFileSrc] = useState<FileType | null>(null);
  const [isClickedHeader, setIsClickedHeader] = useState<boolean>(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
  });
  const inputValue = useRef<HTMLInputElement>(null);
  const bottomListRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { chatId, other } = router.query;

  const onFileChange = (file: Blob) => {
    if (isValidType(file.type)) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const { result } = reader;
        setFileSrc((current) => {
          return {
            type: 'upload',
            file: [...current!.file, file],
            src: [...current!.src, result],
          };
        });
      };
    } else {
      alert('업로드는 이미지만 가능합니다.');
    }
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

  const onSubmitImg = (key?: string) => {
    if (key) {
      downMessage(key);
    } else {
      for (let i = 0; i < fileSrc!.src.length; i++) {
        sendMessage(chatId, fileSrc!.src[i] as string, 'img', fileSrc!.file[i]);
      }
    }
    setFileSrc(null);
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
        <ImgPreviewModal
          fileSrc={fileSrc}
          onFileReset={onFileReset}
          onSubmitImg={onSubmitImg}
        />
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
            .map(({ id, from, msg, img }, idx) => (
              <ChatText
                className={from === 'User1' ? 'mine' : ''}
                key={id}
                ref={idx === 0 ? ref : null}
              >
                {msg ? (
                  msg
                ) : (
                  <ChatImg
                    src={img as string}
                    alt="preview-img"
                    onClick={() =>
                      setFileSrc({
                        type: id as string,
                        file: [],
                        src: [img as string],
                      })
                    }
                  />
                )}
              </ChatText>
            ))}
          <div ref={bottomListRef} />
        </ChatBox>
      </ChatList>
      <ChatInputWrapper>
        <label htmlFor="file">
          <AddIcon style={{ cursor: 'pointer', color: 'white' }} />
        </label>
        <input
          id="file"
          type="file"
          multiple
          hidden
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const { files } = event.target;
            setFileSrc({
              type: 'upload',
              file: [],
              src: [],
            });
            for (let i = 0; i < files!.length; i++) {
              onFileChange(files![i]);
            }
          }}
        />
        <InputBox
          ref={inputValue}
          placeholder="메세지를 입력해주세요."
          required
        />
        <SendIcon
          style={{ position: 'absolute', right: '40px', cursor: 'pointer' }}
          onClick={() => {
            sendMessage(chatId, inputValue.current!.value, 'msg');
            inputValue.current!.value = '';
          }}
        />
      </ChatInputWrapper>
    </Fragment>
  );
};

export default ChatRoom;

const ChatHeader = styled.div`
  color: white;
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
  background: ${({ theme }: any) =>
    theme.customTheme.defaultMode.chatFromBackgroundColor};
  padding: 20px;
  width: 50%;
  min-height: 60px;
  margin: 15px 0;
  border-radius: 20px;
  box-shadow: 0px 1px 1px 0 #00000036;
  &.mine {
    background: ${({ theme }: any) =>
      theme.customTheme.defaultMode.chatToBackgroundColor};
    margin-left: auto;
  }

  @media (prefers-color-scheme: dark) {
    color: white;
    background: ${({ theme }: any) =>
      theme.customTheme.darkMode.chatFromBackgroundColor};
    &.mine {
      background: ${({ theme }: any) =>
        theme.customTheme.darkMode.chatToBackgroundColor};
    }
  }
`;

const ChatImg = styled.img`
  width: 100%;
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
