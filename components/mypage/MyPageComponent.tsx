import Link from 'next/link';
import styled from '@emotion/styled';
import MyPageProfile from './MyPageProfile';
import MyPagePostList from './MyPagePostList';

const MorePage = styled.div`
  & a {
    opacity: 0.3;
    margin: 20px auto 90px auto;
    display: block;
    text-align: center;
  }
`;

const MyPageComponent: React.FC = () => {
  return (
    <>
      <MyPageProfile></MyPageProfile>
      <MyPagePostList></MyPagePostList>
      <MorePage>
        <Link href={'/mypage/posts'}>더보기</Link>
      </MorePage>
    </>
  );
};

export default MyPageComponent;
