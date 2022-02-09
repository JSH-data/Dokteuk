import styled from '@emotion/styled';

const ChatSetting = ({
  onToggle,
  onLeaveChat,
}: {
  onToggle: () => void;
  onLeaveChat: () => void;
}) => {
  return (
    <Background>
      <ModalWrapper>
        <OptionButton>
          <div className="block">차단하기</div>
          <div onClick={onLeaveChat}>채팅방 나가기</div>
        </OptionButton>
        <CancelButton onClick={onToggle}>닫기</CancelButton>
      </ModalWrapper>
    </Background>
  );
};

export default ChatSetting;

const Background = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 999;
  background: #000000bf;
`;

const ModalWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;

  & > div {
    width: clamp(0px, 80%, 600px);
    border-radius: 20px;
    background: white;
    margin-bottom: 20px;
    cursor: pointer;
  }
`;

const OptionButton = styled.div`
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  & .block {
    color: red;
  }
`;

const CancelButton = styled.div`
  height: 50px;
  text-align: center;
  font-weight: bold;
  line-height: 50px;
`;
