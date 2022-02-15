import styled from '@emotion/styled';
import { type } from 'os';

const MyPageheader = styled.div`
  height: 60px;
  position: fixed;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  line-height: 1.2rem;
  font-weight: bold;
  background-color: ${({ theme }: any) =>
    theme.customTheme.defaultMode.footerMenuBackgroundColor};
  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }: any) =>
      theme.customTheme.darkMode.footerMenuBackgroundColor};
    ${({ theme }: any) =>
      `border-top: 2px solid ${theme.customTheme.darkMode.footerBordertopColor};`};
  }
`;

type TestHeaderProps = {
  title: string;
};

const TestHeader: React.FC<TestHeaderProps> = ({ title }) => {
  return <MyPageheader>{title}</MyPageheader>;
};

export default TestHeader;
