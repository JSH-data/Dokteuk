import Link from 'next/link';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import LoginIcon from '@mui/icons-material/Login';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

import { StoreState } from '@interface/StoreInterface';

const FooterDiv = styled.footer`
  ${({ theme }: any) =>
    `border-top: 2px solid ${theme.customTheme.defaultMode.footerBordertopColor};`};

  display: grid;
  grid-template-columns: repeat(6, 1fr);
  padding: 1rem 0.4rem 1rem 0.4rem;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  bottom: 0;
  position: fixed;
  z-index: 99;
  background-color: ${({ theme }: any) =>
    theme.customTheme.defaultMode.footerMenuBackgroundColor};
  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }: any) =>
      theme.customTheme.darkMode.footerMenuBackgroundColor};
    ${({ theme }: any) =>
      `border-top: 2px solid ${theme.customTheme.darkMode.footerBordertopColor};`};
  }
`;
const FooterDivNotLoggedIn = styled(FooterDiv)`
  grid-template-columns: 1fr 1fr 1fr;
`;
const HomeOutlinedIconStyled = styled(HomeOutlinedIcon)`
  color: ${({ theme }: any) => theme.customTheme.defaultMode.footerIconColor};
  @media (prefers-color-scheme: dark) {
    color: ${({ theme }: any) => theme.customTheme.darkMode.footerIconColor};
  }
`;
const SearchOutlinedIconStyled = styled(SearchOutlinedIcon)`
  color: ${({ theme }: any) => theme.customTheme.defaultMode.footerIconColor};
  @media (prefers-color-scheme: dark) {
    color: ${({ theme }: any) => theme.customTheme.darkMode.footerIconColor};
  }
`;

const ForumOutlinedIconStyled = styled(ForumOutlinedIcon)`
  color: ${({ theme }: any) => theme.customTheme.defaultMode.footerIconColor};
  @media (prefers-color-scheme: dark) {
    color: ${({ theme }: any) => theme.customTheme.darkMode.footerIconColor};
  }
`;
const NotificationsNoneOutlinedIconStyled = styled(
  NotificationsNoneOutlinedIcon,
)`
  color: ${({ theme }: any) => theme.customTheme.defaultMode.footerIconColor};
  @media (prefers-color-scheme: dark) {
    color: ${({ theme }: any) => theme.customTheme.darkMode.footerIconColor};
  }
`;
const MoreHorizOutlinedIconStyled = styled(MoreHorizOutlinedIcon)`
  color: ${({ theme }: any) => theme.customTheme.defaultMode.footerIconColor};
  @media (prefers-color-scheme: dark) {
    color: ${({ theme }: any) => theme.customTheme.darkMode.footerIconColor};
  }
`;
const BorderColorOutlinedIconStyled = styled(BorderColorOutlinedIcon)`
  // color: rgba(247, 227, 227, 1);
  background-color: ${({ theme }: any) =>
    theme.customTheme.defaultMode.footerWriteIconBackgroundColor};
  border-radius: 50%;
  padding: 1px;
  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }: any) =>
      theme.customTheme.darkMode.footerWriteIconBackgroundColor};
  }
`;
const DivStyled = styled.div`
  cursor: pointer;
`;
const NotLoggedInElementWrapperDivStyled = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
  color: ${({ theme }: any) => theme.customTheme.defaultMode.footerIconColor};
  @media (prefers-color-scheme: dark) {
    color: ${({ theme }: any) => theme.customTheme.darkMode.footerIconColor};
  }
`;
const Footer = () => {
  const { user: myInfo } = useSelector((state: StoreState) => state.user);
  if (!myInfo.id)
    return (
      <FooterDivNotLoggedIn>
        <DivStyled>
          <Link href="/user/login" passHref>
            <NotLoggedInElementWrapperDivStyled>
              <LoginIcon />
              Login
            </NotLoggedInElementWrapperDivStyled>
          </Link>
        </DivStyled>
        <div />
        <DivStyled>
          <Link href="/user/signup" passHref>
            <NotLoggedInElementWrapperDivStyled>
              <GroupAddIcon />
              SignUp
            </NotLoggedInElementWrapperDivStyled>
          </Link>
        </DivStyled>
      </FooterDivNotLoggedIn>
    );
  return (
    <FooterDiv>
      <DivStyled>
        <Link href="/" passHref>
          <HomeOutlinedIconStyled fontSize="medium" />
        </Link>
      </DivStyled>
      <DivStyled>
        <Link href="/search" passHref>
          <SearchOutlinedIconStyled fontSize="medium" />
        </Link>
      </DivStyled>
      <DivStyled>
        <Link href="/chat" passHref>
          <ForumWrapper>
            <ForumOutlinedIconStyled fontSize="medium" />
            {myInfo.hasNewChatNotification && <Notice />}
          </ForumWrapper>
        </Link>
      </DivStyled>
      <DivStyled>
        <NotificationsNoneOutlinedIconStyled fontSize="medium" />
      </DivStyled>
      <DivStyled>
        <MoreHorizOutlinedIconStyled fontSize="medium" />
      </DivStyled>
      <DivStyled>
        <Link href="/write" passHref>
          <BorderColorOutlinedIconStyled fontSize="medium" />
        </Link>
      </DivStyled>
    </FooterDiv>
  );
};

export default Footer;

const ForumWrapper = styled.div`
  position: relative;
`;

const Notice = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: red;
  position: absolute;
  top: 0;
  left: calc(50% + 5px);
`;
