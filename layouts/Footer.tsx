import styled from '@emotion/styled';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import Link from 'next/link';

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
  background-color: ${({ theme }: any) =>
    theme.customTheme.defaultMode.footerMenuBackgroundColor};
  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }: any) =>
      theme.customTheme.darkMode.footerMenuBackgroundColor};
    ${({ theme }: any) =>
      `border-top: 2px solid ${theme.customTheme.darkMode.footerBordertopColor};`};
  }
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
const Footer = () => {
  return (
    <FooterDiv>
      <Link href="/">
        <div>
          <HomeOutlinedIconStyled fontSize="medium" />
        </div>
      </Link>
      <div>
        <Link href="/search">
          <SearchOutlinedIconStyled fontSize="medium" />
        </Link>
      </div>
      <Link href="/chatting">
        <div>
          <ForumOutlinedIconStyled fontSize="medium" />
        </div>
      </Link>
      <div>
        <NotificationsNoneOutlinedIconStyled fontSize="medium" />
      </div>
      <div>
        <MoreHorizOutlinedIconStyled fontSize="medium" />
      </div>
      <div>
        <BorderColorOutlinedIconStyled fontSize="medium" />
      </div>
    </FooterDiv>
  );
};

export default Footer;
