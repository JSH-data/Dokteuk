import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const ImgPreviewModal = ({
  fileSrc,
  onFileReset,
}: {
  fileSrc: String | ArrayBuffer | null;
  onFileReset: () => void;
}) => {
  return (
    <Background>
      <Modal>
        <Image src={fileSrc as string} alt="preview-image" />
        <ButtonWrapper>
          <button onClick={onFileReset}>취소</button>
          <button className="send">전송</button>
        </ButtonWrapper>
      </Modal>
    </Background>
  );
};

export default ImgPreviewModal;

const Background = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 999;
  background: #000000bf;
`;

const slideDown = keyframes`
from {
  opacity: 0;
  transform: translateY(-30vh);
}
to {
  opacity: 1;
  transform: translateY(10%);
}`;

const Modal = styled.div`
  margin: 0 auto;
  width: clamp(0px, 80%, 680px);
  height: 80%;
  padding: 30px 15px;
  background-color: white;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  animation: ${slideDown} 0.3s ease-out forwards;
  z-index: 30;
  display: flex;
  flex-direction: column;
`;

const Image = styled.div<ImgProps>`
  width: 80%;
  height: calc(100% - 80px);
  background: url(${(props) => props.src}) no-repeat center center;
  background-size: contain;
  margin: 0 auto;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  padding-top: 30px;

  & button {
    background: none;
    border: none;
    border-radius: 10px;
    width: 100px;
    height: 50px;
  }

  & button.send {
    background: #8946a6;
  }
`;
