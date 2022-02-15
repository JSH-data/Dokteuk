import { Dispatch, SetStateAction } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { keyframes } from '@emotion/react';
import { EffectCards } from 'swiper';
import styled from '@emotion/styled';
import 'swiper/css';
import 'swiper/css/effect-cards';

const ImgPreviewModal = ({
  imgData,
  setImgData,
  onFileReset,
  onSubmitImg,
}: {
  imgData: FileType | null;
  setImgData: Dispatch<SetStateAction<FileType | null>>;
  onFileReset: () => void;
  onSubmitImg: (k?: string) => void;
}) => {
  const DeleteImgHandler = (idx: number) => {
    setImgData((current) => {
      const newData = { ...current };
      newData.src!.splice(idx, 1);
      newData.file!.splice(idx, 1);

      if (newData.src!.length === 0) {
        return null;
      }

      return {
        type: 'upload',
        file: [...newData.file!],
        src: [...newData.src!],
      };
    });
  };

  return (
    <Background>
      <Modal>
        <SwiperStyled
          effect={'cards'}
          grabCursor={true}
          modules={[EffectCards]}
        >
          {imgData!.src.map((img, idx) => (
            <SwiperSlide key={img as string}>
              <Image src={img as string} alt="preview-img" />
              <DeleteImg onClick={() => DeleteImgHandler(idx)}>X</DeleteImg>
            </SwiperSlide>
          ))}
        </SwiperStyled>
        <ButtonWrapper>
          <button onClick={onFileReset}>취소</button>
          <button
            className="send"
            onClick={() =>
              imgData!.type === 'upload'
                ? onSubmitImg()
                : onSubmitImg(imgData!.type)
            }
          >
            {imgData!.type === 'upload' ? '전송' : '다운'}
          </button>
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
  transform: translateY(-80vh);
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
  background-color: ${({ theme }: any) =>
    theme.customTheme.defaultMode.chatFromBackgroundColor};
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  animation: ${slideDown} 0.5s ease-out forwards;
  z-index: 30;
  display: flex;
  flex-direction: column;

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) =>
      theme.customTheme.darkMode.chatFromBackgroundColor};
  }
`;

const SwiperStyled = styled(Swiper)`
  width: 240px;
  height: calc(100% - 80px);
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #cecece;
  border-radius: 10px;

  @media (prefers-color-scheme: dark) {
    background: #171717;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  padding-top: 30px;

  & button {
    color: black;
    background: none;
    border: none;
    border-radius: 10px;
    width: 100px;
    height: 50px;
  }
  & button.send {
    background: ${({ theme }: any) =>
      theme.customTheme.defaultMode.chatToBackgroundColor};
  }

  @media (prefers-color-scheme: dark) {
    & button {
      color: white;
    }
    & button.send {
      background: ${({ theme }: any) =>
        theme.customTheme.darkMode.chatToBackgroundColor};
    }
  }
`;

const DeleteImg = styled.div`
  color: white;
  position: absolute;
  top: 15px;
  right: 15px;
  font-weight: bold;
`;
