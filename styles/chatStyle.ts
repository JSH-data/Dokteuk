import styled from '@emotion/styled';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';

export {
  KeyboardArrowDownIcon,
  ArrowBackIosNewIcon,
  DensityMediumIcon,
  AddIcon,
  SendIcon,
};

// Chat_List
export const ChatMain = styled.div`
  padding-bottom: 60px;
`;

export const EmptyChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: clamp(0px, 80%, 680px);
  height: 80px;
  text-align: center;
  margin: 20px auto;
  border-radius: 10px;
  background: white;

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) => theme.mainColorBlack};
  }
`;

export const ChatWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: clamp(0px, 80%, 680px);
  height: 80px;
  margin: 20px auto;
  padding: 0 20px;
  cursor: pointer;
  border-radius: 10px;
  background: white;
  & > div {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  & .text {
    width: clamp(0px, 75%, 450px);
  }

  & .userInfo {
    display: flex;
    font-size: 18px;
    & .job {
      padding-left: 10px;
      font-size: 12px;
      display: flex;
      align-items: flex-end;
    }
  }

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) => theme.mainColorBlack};
  }
`;

export const Text = styled.div`
  padding-left: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const Notice = styled.div<NoticeProps>`
  background: ${(props) => (props.isRead ? 'none' : 'red')};
  height: 20px;
  width: 20px;
  border-radius: 50%;
  margin: 0 auto;
`;

// Chat_Room
export const NewMessage = styled.div`
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  position: absolute;
  left: 0;
  bottom: 60px;
  cursor: pointer;
  background: ${({ theme }: any) => theme.mainColorPink};

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) => theme.mainColorBlue};
  }
`;

export const ChatHeader = styled.div`
  color: white;
  position: fixed;
  width: 100vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  z-index: 999;
  background: ${({ theme }: any) => theme.mainColorViolet};

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) => theme.mainColorBlack};
  }
`;

export const ChatBox = styled.ul`
  padding: 60px 30px 90px 30px;
  margin: 0;
  color: black;
`;

export const ChatText = styled.li`
  color: black;
  list-style: none;
  background: white;
  padding: 20px;
  width: 50%;
  min-height: 60px;
  word-break: break-all;
  margin: 15px 0;
  border-radius: 20px;
  box-shadow: 0px 1px 1px 0 #00000036;
  &.mine {
    background: ${({ theme }: any) => theme.mainColorPink};
    margin-left: auto;
  }

  @media (prefers-color-scheme: dark) {
    color: white;
    background: ${({ theme }: any) => theme.blackGray};
    &.mine {
      background: ${({ theme }: any) => theme.mainColorBlue};
    }
  }
`;

export const ChatImg = styled.img`
  width: 100%;
`;

export const ChatInputWrapper = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background: ${({ theme }: any) => theme.mainColorViolet};
  padding: 0 20px;

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) => theme.mainColorBlack};
  }
`;

export const FormBox = styled.form`
  border-radius: 20px;
  border: none;
  width: 100%;
  height: 40px;
  margin-left: 20px;
  padding-left: 30px;
  padding-right: 60px;
  background: #f2f2f2;
`;

export const InputBox = styled.input`
  border-radius: 20px;
  border: none;
  width: 100%;
  height: 40px;
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

export const SendIconStyled = styled(SendIcon)`
  position: absolute;
  right: 40px;
  bottom: 18px;
  cursor: pointer;
  color: gray;
`;

export const PageDownBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  position: absolute;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  bottom: 80px;
  right: 30px;
  box-shadow: 0px 1px 1px 0 #00000036;
  background: ${({ theme }: any) => theme.whiteGray};

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) => theme.blackGray};
    color: white;
  }
`;

export const DateWrapper = styled.div`
  height: 20px;
  padding: 50px 0 30px 0;
  position: relative;
  display: flex;
  align-items: center;
`;

export const Line = styled.div`
  width: 100%;
  border-bottom: 1px solid ${({ theme }: any) => theme.lightGray};

  @media (prefers-color-scheme: dark) {
    border-bottom: 1px solid ${({ theme }: any) => theme.darkGray};
  }
`;

export const Date = styled.div`
  position: absolute;
  padding: 0 20px;
  left: 50%;
  transform: translate(-50%);
  font-size: 14px;
  color: ${({ theme }: any) => theme.middleGray};
  background: ${({ theme }: any) => theme.whiteGray};

  @media (prefers-color-scheme: dark) {
    background: #111113;
    color: ${({ theme }: any) => theme.lightGray};
  }
`;
