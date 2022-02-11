import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootReducer } from 'store/reducer';
import {
  ChangeEvent,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  sendMessage,
  chatMessages,
  moreChatMessages,
  exitChat,
  leaveChat,
  downMessage,
} from '../api/chat';
import { Timestamp } from 'firebase/firestore';
import { isValidType, isValidSize } from '../../utils/upload';
import { useInView } from 'react-intersection-observer';
import debounce from 'lodash/debounce';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ImgPreviewModal from '@components/ImgPreviewModal';
import ChatSetting from '@components/ChatSetting';
import styled from '@emotion/styled';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';

const ChatRoom = () => {
  const { user } = useSelector((state: RootReducer) => state.user);
  const [messages, setMessages] = useState<ChatText[]>([]);
  const [isScrollUp, setIsScrollUp] = useState<boolean>();
  const [scrollPosition, setScrollPosition] = useState<number>();
  const [lastKey, setLastKey] = useState<Timestamp | null>(null);
  const [fileSrc, setFileSrc] = useState<FileType | null>(null);
  const [isClickedHeader, setIsClickedHeader] = useState<boolean>(false);
  const [ref, inView] = useInView();
  const messageRef = useRef<HTMLDivElement>(null);
  const bottomListRef = useRef<HTMLDivElement>(null);
  const inputValue = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { chatId, other } = router.query;

  const onFileChange = (file: Blob) => {
    if (isValidType(file.type) && isValidSize(file.size)) {
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
    } else if (isValidSize(file.size)) {
      alert('업로드는 이미지만 가능합니다.');
      setFileSrc(null);
    } else {
      alert('1Mb 이하로만 올릴 수 있습니다.');
      setFileSrc(null);
    }
  };

  const onFileReset = () => {
    setFileSrc(null);
  };

  const onToggle = () => {
    setIsClickedHeader(!isClickedHeader);
  };

  const onLeaveChat = () => {
    exitChat(chatId, user);
    router.replace(`/chatting`);
  };

  const onSubmitImg = (key?: string) => {
    if (key) {
      downMessage(key);
    } else {
      for (let i = 0; i < fileSrc!.src.length; i++) {
        sendMessage(
          chatId,
          fileSrc!.src[i] as string,
          'img',
          user,
          fileSrc!.file[i],
        );
      }
    }
    setFileSrc(null);
  };

  const onScroll = debounce(() => {
    setIsScrollUp(
      messageRef.current!.scrollHeight - messageRef.current!.scrollTop >
        messageRef.current!.clientHeight * 2,
    );
    setScrollPosition(messageRef.current!.scrollTop);
  }, 500);

  const pageDown = () => {
    bottomListRef.current!.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollKeep = (prevScrollHeight: number) => {
    messageRef.current!.scrollTop =
      messageRef.current!.scrollHeight - prevScrollHeight;
  };

  const getMessages = useCallback(
    async (prevScrollHeight) => {
      await moreChatMessages(chatId, setMessages, setLastKey, lastKey, user);
      scrollKeep(prevScrollHeight);
    },
    [chatId, lastKey, user],
  );

  useEffect(() => {
    const unsubscribe = chatMessages(chatId, setMessages, setLastKey, user);

    return () => {
      leaveChat(chatId, user);
      unsubscribe();
    };
  }, [chatId, user]);

  useEffect(() => {
    pageDown();
  }, [messages]);

  useEffect(() => {
    if (scrollPosition === 0 && inView && lastKey) {
      const prevScrollHeight =
        messageRef.current!.scrollHeight - messageRef.current!.scrollTop;
      getMessages(prevScrollHeight);
    }
  }, [scrollPosition, inView]);

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
      {isScrollUp && (
        <PageDownBtn
          onClick={() => {
            bottomListRef.current!.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <KeyboardArrowDownIcon />
        </PageDownBtn>
      )}
      <ChatList onScroll={onScroll} ref={messageRef}>
        <ChatBox>
          {messages
            .slice()
            .reverse()
            .map(({ id, from, msg, img }, idx) => (
              <ChatText
                className={from === user.nickname ? 'mine' : ''}
                ref={idx === 0 ? ref : null}
                key={id}
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
            sendMessage(chatId, inputValue.current!.value, 'msg', user);
            inputValue.current!.value = '';
            setIsScrollUp(false);
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

const PageDownBtn = styled.button`
  width: 40px;
  height: 40px;
  position: absolute;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  bottom: 80px;
  right: 30px;
  box-shadow: 0px 1px 1px 0 #00000036;
  background: ${({ theme }: any) =>
    theme.customTheme.defaultMode.chatFromBackgroundColor};

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) =>
      theme.customTheme.darkMode.chatFromBackgroundColor};
    color: white;
  }
`;
