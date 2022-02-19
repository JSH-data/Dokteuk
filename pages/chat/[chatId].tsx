import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
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
} from '@utils/chat';
import {
  NewMessage,
  ChatHeader,
  ChatBox,
  ChatText,
  ChatImg,
  ChatInputWrapper,
  FormBox,
  InputBox,
  SendIconStyled,
  PageDownBtn,
  DateWrapper,
  Line,
  Date,
  MyInfo,
  KeyboardArrowDownIcon,
  ArrowBackIosNewIcon,
  DensityMediumIcon,
  AddIcon,
} from '@styles/chatStyle';
import { useRouter } from 'next/router';
import { Timestamp } from 'firebase/firestore';
import { getDate } from '@utils/function';
import { encodeFile } from '@utils/upload';
import wrapper from '@store/configureStore';
import debounce from 'lodash/debounce';
import ImgPreviewModal from '@components/ImgPreviewModal';
import ChatSetting from '@components/ChatSetting';
import { ParsedUrlQuery } from 'querystring';

const ChatRoom = ({ user }: { user: Person }) => {
  const [messages, setMessages] = useState<ChatText[]>([]);
  const [newMessage, setNewMessage] = useState<boolean>(false);
  const [lastMessage, setLastMessage] = useState<ChatText | null>(null);
  const [isBottom, setIsBottom] = useState<boolean>(true);
  const [scrollPosition, setScrollPosition] = useState<number>();
  const [startKey, setStartKey] = useState<Timestamp | null>(null);
  const [imgData, setImgData] = useState<FileType | null>(null);
  const [isClickedHeader, setIsClickedHeader] = useState<boolean>(false);
  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputValue = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [query, setQuery] = useState<ParsedUrlQuery>(router.query);

  const onFileReset = () => {
    setImgData(null);
  };

  const onToggle = () => {
    setIsClickedHeader(!isClickedHeader);
  };

  const onExitChat = () => {
    exitChat(query.chatId, user.id);
    router.replace(`/chat`);
  };

  const onSubmitImg = (key?: string) => {
    if (key) {
      downloadImg(key);
    } else {
      for (let i = 0; i < imgData!.src.length; i++) {
        const img = {
          src: imgData!.src[i],
          file: imgData!.file[i],
        };
        onSendMessage(img);
      }
    }
    setImgData(null);
  };

  const onSendMessage = async (img?: ImgType) => {
    if (img) {
      await sendMessage(
        query.chatId,
        img.src as string,
        'img',
        user.id,
        query.id,
        img.file,
      );
    } else {
      const value = inputValue.current!.value;
      inputValue.current!.value = '';
      if (messages.length === 0) {
        // 채팅방 개설하고 첫 메세지일 경우
        await sendMessage(
          query.chatId,
          value,
          'msg',
          user.id,
          query.id,
          undefined,
          query.id,
        );
      } else {
        await sendMessage(query.chatId, value, 'msg', user.id, query.id);
      }
    }
  };

  const reversedMessages = useMemo(
    () => messages.slice().reverse(),
    [messages],
  );

  const getInitData = useCallback(async () => {
    const { initMessage, _startKey, _endKey } = await getChatMessages(
      query.chatId,
    );
    setMessages(initMessage);
    setLastMessage(initMessage[0]);
    setStartKey(_startKey);

    return chatMessages(query.chatId, setMessages, _endKey);
  }, [query.chatId]);

  const getMessages = useCallback(
    async (prevScrollHeight) => {
      const { moreMessage, _startKey } = await moreChatMessages(
        query.chatId,
        startKey,
      );
      setMessages((current) => [...current, ...moreMessage]);
      setScrollPosition(prevScrollHeight);
      setStartKey(_startKey);
      scrollKeep(prevScrollHeight);
    },
    [query.chatId, startKey],
  );

  const onScroll = debounce(() => {
    if (listRef.current) {
      setIsBottom(
        listRef.current.clientHeight - window.innerHeight <
          window.scrollY + window.innerHeight,
      );
      setScrollPosition(window.scrollY);
    }
  }, 500);

  const scrollKeep = (prevScrollHeight: number) => {
    const currentScroll =
      listRef.current!.clientHeight - window.innerHeight - prevScrollHeight;
    window.scrollTo(0, currentScroll);
  };

  const onPageDown = () => {
    bottomRef.current!.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    getInitData();
    window.addEventListener('scroll', onScroll);

    if (router.query.other) {
      window.localStorage.setItem('queryData', JSON.stringify(query));
    } else {
      const otherData = window.localStorage.getItem('queryData');
      setQuery(JSON.parse(otherData as string));
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.localStorage.removeItem('queryData');
      getInitData();
      setStartKey(null);
      leaveChat(query.chatId, user.id);
    };
  }, [getInitData, query.chatId, user]);

  useEffect(() => {
    const newMsg = messages[0];
    if (!isBottom && newMsg !== lastMessage && newMsg.from !== user.id) {
      // 스크롤이 올라가있고 내가 보낸 메세지가 아닌 타인이 보낸 새로운 메세지가 있을 경우
      // 페이지를 내리지 않고 팝업으로 새메세지가 왔다는걸 표시
      return setNewMessage(true);
    } else {
      // Page Down
      onPageDown();
    }
    setLastMessage(newMsg);
  }, [messages]);

  useEffect(() => {
    // 이전데이터가 있고, 스크롤이 맨 위로 올라올 경우 이전 데이터를 불러옴
    if (scrollPosition! < 60 && startKey) {
      const prevScrollHeight =
        listRef.current!.clientHeight - window.innerHeight;
      getMessages(prevScrollHeight);
    } else if (
      listRef.current!.clientHeight - window.innerHeight ===
      window.scrollY
    ) {
      // 스크롤이 맨 밑으로 내려갔을 경우
      setNewMessage(false);
    }
  }, [scrollPosition, startKey, getMessages]);

  return (
    <div style={{ height: '100vh' }}>
      {imgData && imgData.src.length > 0 && (
        <ImgPreviewModal
          imgData={imgData}
          setImgData={setImgData}
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
        <div>{query.other}</div>
        <DensityMediumIcon onClick={onToggle} />
      </ChatHeader>
      <div ref={listRef}>
        <ChatBox>
          <MyInfo>{`"${query.mine}"`} 닉네임으로 채팅중 입니다.</MyInfo>
          {reversedMessages.map(({ id, from, msg, img, createAt }, idx) => (
            <div key={id}>
              {(idx === 0 ||
                getDate(createAt).isAnotherDay(
                  reversedMessages[idx - 1].createAt,
                )) && (
                <DateWrapper>
                  <Line />
                  <Date>
                    {`${
                      getDate(createAt).isAnotherYear()
                        ? `${getDate(createAt).year}년 `
                        : ``
                    }${getDate(createAt).month}월 ${getDate(createAt).date}일`}
                  </Date>
                </DateWrapper>
              )}
              <ChatText className={from === user.id ? 'mine' : ''}>
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
            </div>
          ))}
          <div ref={bottomRef} />
        </ChatBox>
      </div>
      <ChatInputWrapper className="input">
        {!isBottom && !newMessage && (
          <PageDownBtn onClick={onPageDown}>
            <KeyboardArrowDownIcon />
          </PageDownBtn>
        )}
        {newMessage && (
          <NewMessage onClick={onPageDown}>새로운 메세지가 있습니다</NewMessage>
        )}
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
    </div>
  );
};

export default ChatRoom;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params }) => {
      const data = store.getState();

      if (data.user.user.nickname == '') {
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
