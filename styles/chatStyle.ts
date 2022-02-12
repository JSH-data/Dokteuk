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

export const NewMessage = styled.div`
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  position: absolute;
  bottom: 60px;
  cursor: pointer;
  background: ${({ theme }: any) =>
    theme.customTheme.defaultMode.chatToBackgroundColor};

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) =>
      theme.customTheme.darkMode.chatToBackgroundColor};
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
  background: ${({ theme }: any) =>
    theme.customTheme.defaultMode.headerMenuBackgroundColor};
  padding: 0 20px;

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) =>
      theme.customTheme.darkMode.headerMenuBackgroundColor};
  }
`;

export const ChatList = styled.div`
  padding-top: 60px;
  height: calc(100vh - 60px);
  overflow: scroll;
`;

export const ChatBox = styled.ul`
  padding: 30px;
  margin: 0;
  color: black;
`;

export const ChatText = styled.li`
  color: ${({ theme }: any) =>
    theme.customTheme.defaultMode.searchInputTextColor};
  list-style: none;
  background: ${({ theme }: any) =>
    theme.customTheme.defaultMode.chatFromBackgroundColor};
  padding: 20px;
  width: 50%;
  min-height: 60px;
  word-break: break-all;
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

export const ChatImg = styled.img`
  width: 100%;
`;

export const ChatInputWrapper = styled.div`
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

export const InputBox = styled.input`
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

export const PageDownBtn = styled.button`
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

export const ChatMain = styled.div`
  height: calc(100vh - 120px);
  overflow: scroll;
`;
export const EmptyChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: clamp(0px, 80%, 680px);
  height: calc(100% - 40px);
  text-align: center;
  margin: 20px auto;
  border-radius: 10px;
  background: ${({ theme }: any) =>
    theme.customTheme.defaultMode.cardWrapperBackgroundColor};

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) =>
      theme.customTheme.darkMode.cardWrapperBackgroundColor};
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
  background: ${({ theme }: any) =>
    theme.customTheme.defaultMode.cardWrapperBackgroundColor};
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
    font-size: 20px;
    & .job {
      padding-left: 10px;
      font-size: 12px;
      display: flex;
      align-items: flex-end;
    }
  }

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) =>
      theme.customTheme.darkMode.cardWrapperBackgroundColor};
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
