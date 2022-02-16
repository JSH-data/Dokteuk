import type {
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import MyPageProfile from '@components/mypage/MyPageProfile';
import Layout from '@layouts/Layout';
import Container from '@mui/material/Container';
import wrapper from '@store/configureStore';
import styled from '@emotion/styled';
import { useEffect } from 'react';

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
  background-color: ${({ theme }: any) => theme.mainColorViolet};
  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }: any) => theme.mainColorBlack};
    ${({ theme }: any) => `border-top: 2px solid ${theme.blackGray};`};
  }
`;

const MyPage: NextPage = ({
  email,
  userId,
  nickname,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useEffect(() => {}, []);
  return (
    <>
      <Head>
        <title>마이페이지</title>
        <meta name="description" content="Generate by elice Team 5" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MyPageheader>마이페이지</MyPageheader>
      <Layout>
        <Container>
          <MyPageProfile email={email} nickname={nickname} />
        </Container>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (ctx) => {
    const data = store.getState();
    console.log(data, '마이페이지 데이터');
    if (data.user.user.nickname == '') {
      // todo: 초기값을 판단하는 근거가 이상함...
      return {
        redirect: {
          destination: '/404',
          permanent: false,
        },
      };
    }

    return {
      props: {
        email: data.user.user.email,
        userId: data.user.user.id,
        nickname: data.user.user.nickname,
      },
    };
  });

export default MyPage;
