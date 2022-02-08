import Link from 'next/link';
import styled from '@emotion/styled';
import { MyPageListComponent } from './MyPageListComponent';

const MyPageProfileLi = styled.li`
  margin: 0 auto;
  margin-bottom: 30px;
  font-size: 1.1rem;
  width: 80%;
`;

const MyPageProfile: React.FC = () => {
  return (
    <MyPageListComponent>
      <h1>프로필</h1>
      <ul>
        <MyPageProfileLi>Email </MyPageProfileLi>
        <MyPageProfileLi>
          <Link href={'/mypage/nickname'}>닉네임 변경하기</Link>
        </MyPageProfileLi>
        <MyPageProfileLi>
          <Link href={'/mypage/password'}>비밀번호 변경하기</Link>
        </MyPageProfileLi>
      </ul>
    </MyPageListComponent>
  );
};

export default MyPageProfile;
