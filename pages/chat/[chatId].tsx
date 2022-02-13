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
  downloadImg,
  getChatMessages,
} from '../api/chat';
import {
  NewMessage,
  ChatHeader,
  ChatList,
  ChatBox,
  ChatText,
  ChatImg,
  ChatInputWrapper,
  FormBox,
  InputBox,
  SendIconStyled,
  PageDownBtn,
  KeyboardArrowDownIcon,
  ArrowBackIosNewIcon,
  DensityMediumIcon,
  AddIcon,
} from '../../styles/chatStyle';
import { useRouter } from 'next/router';
import { Timestamp } from 'firebase/firestore';
import { encodeFile } from '../../utils/upload';
import wrapper from '@store/configureStore';
import debounce from 'lodash/debounce';
import ImgPreviewModal from '@components/ImgPreviewModal';
import ChatSetting from '@components/ChatSetting';

const ChatRoom = ({ user }: { user: Person }) => {
  const [messages, setMessages] = useState<ChatText[]>([]);
  const [newMessage, setNewMessage] = useState<boolean>(false);
  const [lastMessage, setLastMessage] = useState<ChatText | null>(null);
  const [isScrollUp, setIsScrollUp] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState<number>();
  const [startKey, setStartKey] = useState<Timestamp | null>(null);
  const [imgData, setImgData] = useState<FileType | null>(null);
  const [isClickedHeader, setIsClickedHeader] = useState<boolean>(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const bottomListRef = useRef<HTMLDivElement>(null);
  const inputValue = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { chatId, other, id } = router.query;

  const onFileReset = () => {
    setImgData(null);
  };

  const onToggle = () => {
    setIsClickedHeader(!isClickedHeader);
  };

  const onExitChat = () => {
    exitChat(chatId, user.id);
    router.replace(`/chat`);
  };

  const onSubmitImg = (key?: string) => {
    if (key) {
      downloadImg(key);
    } else {
      for (let i = 0; i < imgData!.src.length; i++) {
        onSendMessage(imgData!.src[i] as string);
      }
    }
    setImgData(null);
  };

  const onSendMessage = async (img?: string) => {
    if (img) {
      await sendMessage(chatId, img, 'img', user.id);
    } else {
      const value = inputValue.current!.value;
      inputValue.current!.value = '';
      if (messages.length === 0 && id) {
        // 첫 메세지일 경우
        await sendMessage(chatId, value, 'msg', user.id, undefined, id);
      } else {
        await sendMessage(chatId, value, 'msg', user.id);
      }
    }
    setIsScrollUp(false);
  };

  const onScroll = debounce(() => {
    setIsScrollUp(
      messageRef.current!.scrollHeight - messageRef.current!.scrollTop >
        messageRef.current!.clientHeight * 2,
    );
    setScrollPosition(messageRef.current!.scrollTop);
  }, 500);

  const getInitData = useCallback(async () => {
    const { initMessage, _startKey, _endKey } = await getChatMessages(chatId);
    setMessages(initMessage);
    setLastMessage(initMessage[0]);
    setStartKey(_startKey);

    return chatMessages(chatId, setMessages, _endKey);
  }, [chatId]);

  const getMessages = useCallback(
    async (prevScrollHeight) => {
      const { moreMessage, _startKey } = await moreChatMessages(
        chatId,
        startKey,
      );
      setMessages((current) => [...current, ...moreMessage]);
      setStartKey(_startKey);
      scrollKeep(prevScrollHeight);
      setScrollPosition(prevScrollHeight);
    },
    [chatId, startKey],
  );

  const scrollKeep = (prevScrollHeight: number) => {
    messageRef.current!.scrollTop =
      messageRef.current!.scrollHeight - prevScrollHeight;
  };

  useEffect(() => {
    getInitData();

    return () => {
      getInitData();
      setStartKey(null);
      leaveChat(chatId, user.id);
    };
  }, [getInitData, chatId, user]);

  useEffect(() => {
    const newMsg = messages[0];
    if (isScrollUp && newMsg !== lastMessage && newMsg.from !== user.nickname) {
      setNewMessage(true);
      return;
    } else if (!isScrollUp) {
      // Page Down
      bottomListRef.current!.scrollIntoView({ behavior: 'smooth' });
    }
    setLastMessage(newMsg);
  }, [messages, isScrollUp]);

  useEffect(() => {
    // 스크롤이 맨 위로 올라올 경우 이전 데이터를 불러옴
    if (scrollPosition! < 60 && startKey) {
      // 현재 스크롤 위치 저장
      const prevScrollHeight =
        messageRef.current!.scrollHeight - messageRef.current!.scrollTop;
      getMessages(prevScrollHeight);
    } else if (
      scrollPosition! + messageRef.current!.clientHeight ===
      messageRef.current!.scrollHeight
    ) {
      setNewMessage(false);
    }
  }, [scrollPosition]);

  return (
    <Fragment>
      {imgData && (
        <ImgPreviewModal
          imgData={imgData}
          onFileReset={onFileReset}
          onSubmitImg={onSubmitImg}
        />
      )}
      {isClickedHeader && (
        <ChatSetting onToggle={onToggle} onExitChat={onExitChat} />
      )}
      <ChatHeader>
        <ArrowBackIosNewIcon
          onClick={() => router.replace(`/chat`)}
          style={{ cursor: 'pointer' }}
        />
        <div>{other}</div>
        <DensityMediumIcon onClick={onToggle} />
      </ChatHeader>
      {isScrollUp && !newMessage && (
        <PageDownBtn
          onClick={() => {
            setIsScrollUp(false);
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
            .map(({ id, from, msg, img }) => (
              <ChatText className={from === user.id ? 'mine' : ''} key={id}>
                {msg ? (
                  msg
                ) : (
                  <ChatImg
                    src={img as string}
                    alt="preview-img"
                    onClick={() =>
                      setImgData({
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
      {newMessage && (
        <NewMessage onClick={() => setIsScrollUp(false)}>
          새로운 메세지가 있습니다
        </NewMessage>
      )}
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
            setImgData({
              type: 'upload',
              file: [],
              src: [],
            });
            for (let i = 0; i < files!.length; i++) {
              encodeFile(files![i], setImgData);
            }
          }}
        />
        <FormBox
          onSubmit={(e) => {
            e.preventDefault();
            onSendMessage();
          }}
        >
          <InputBox
            ref={inputValue}
            placeholder="메세지를 입력해주세요."
            required
          />
          <SendIconStyled onClick={() => onSendMessage()} />
        </FormBox>
      </ChatInputWrapper>
    </Fragment>
  );
};

export default ChatRoom;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const data = store.getState();

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
        user: {
          nickname: data.user.user.nickname,
          jobSector: data.user.user.jobSector,
          id: data.user.user.id,
        },
      },
    };
  },
);
