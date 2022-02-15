import React, { useState } from 'react';
import styled from '@emotion/styled';
import { getDateTime } from '@utils/function';
import AuthorClickMenu from '@components/items/AuthorClickMenu';
import { ChatDefault, createChatRoom } from '@utils/createChatRoom';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootReducer } from '@store/reducer';

const CommentAuthorDiv = styled.div`
  margin-bottom: 25px;
  display: flex;
  justify-content: space-between;
`;

const CommentNickname = styled.span`
  color: grey;
  font-size: 0.8rem;
`;

type authorProps = {
  nickname: string;
  job: string;
  date: string;
  userId: string;
};

const CommentAuthorComponent: React.FC<authorProps> = ({
  date,
  nickname,
  job,
  userId,
}) => {
  const [toggle, setToggle] = useState(false);
  const router = useRouter();

  const onToggle = () => {
    setToggle(false);
  };

  const userInfo = useSelector((state: RootReducer) => state.user.user);

  const openChat = async () => {
    const myInfo: ChatDefault = {
      nickname: userInfo.nickname,
      jobSector: userInfo.job,
      id: userInfo.userId,
    };
    const counterInfo: ChatDefault = {
      nickname: nickname,
      jobSector: job,
      id: userId,
    };
    const id = await createChatRoom(myInfo, counterInfo);

    router.push(
      `/chat/${id}?other=${counterInfo.nickname}&id=${counterInfo.id}`,
    );
  };

  return (
    <>
      <CommentAuthorDiv>
        <div>{getDateTime(date)}</div>
        <div>
          <CommentNickname
            onClick={() => {
              setToggle(true);
            }}
          >
            {nickname}
          </CommentNickname>

          {`  `}

          <span>{job}</span>
        </div>
      </CommentAuthorDiv>
      {toggle && <AuthorClickMenu onToggle={onToggle} openChat={openChat} />}
    </>
  );
};

export default CommentAuthorComponent;
