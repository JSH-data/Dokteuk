import styled from '@emotion/styled';

const AuthorClickMenu = ({
  onToggle,
  openChat,
}: {
  onToggle: () => void;
  openChat: () => void;
}) => {
  return (
    <Background>
      <ModalWrapper>
        <OptionButton>
          <div className="exit" onClick={openChat}>
            채팅하기
          </div>
        </OptionButton>
        <CancelButton onClick={onToggle}>닫기</CancelButton>
      </ModalWrapper>
    </Background>
  );
};

export default AuthorClickMenu;

const Background = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 999;
  background: #000000bf;
  top: 0;
  left: 0;
`;

const ModalWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  color: black;

  & > div {
    width: clamp(0px, 80%, 600px);
    border-radius: 20px;
    background-color: ${({ theme }: any) =>
      theme.customTheme.defaultMode.chatFromBackgroundColor};
    margin-bottom: 20px;
    cursor: pointer;
  }

  @media (prefers-color-scheme: dark) {
    color: white;
    & > div {
      background-color: ${({ theme }: any) =>
        theme.customTheme.darkMode.chatFromBackgroundColor};
    }
  }
`;

const OptionButton = styled.div`
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;

  & .text {
    font-size: 12px;
    color: gray;
    height: 30px;
    line-height: 30px;
  }
  & .exit {
    height: 50px;
    line-height: 50px;
  }
`;

const Line = styled.div`
  border-bottom: 1px solid #d1d1d1;
  width: 100%;

  @media (prefers-color-scheme: dark) {
    border-bottom: 1px solid #3f3f3f;
  }
`;

const CancelButton = styled.div`
  height: 50px;
  text-align: center;
  font-weight: bold;
  line-height: 50px;
`;
