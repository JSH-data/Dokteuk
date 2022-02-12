import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import HeaderHome from '@components/Headers/Home';
import HeaderSkeleton from '@components/Headers/Skeleton';
import TestHeader from './TestHeader';

const Header: React.FC = () => {
  const router = useRouter();
  const headerKey = router.pathname.split('/')[1];
  const topic = router.query.topic as string;

  return (
    <HeaderWrapperDivStyled>
      {topic !== undefined && <TestHeader title={topic} />}
      {headerKey === 'list' && topic == undefined && <HeaderHome />}
      {/* {headerKey === 'chatting' && <HeaderChatting />} */}
      {/* {headerKey === 'notification' && <HeaderNotification />} */}
      {/* {headerKey === 'mypage' && <HeaderMyPage />} */}
    </HeaderWrapperDivStyled>
  );
};
export default Header;
export const HeaderWrapperDivStyled = styled.div`
  position: fixed;
  z-index: 99;
  width: 100vw;
`;
