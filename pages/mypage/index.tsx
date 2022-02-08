import type { NextPage } from 'next';
import Head from 'next/head';
import MyPageComponent from '@components/mypage/MyPageComponent';
import Layout from '@layouts/Layout';
import Container from '@mui/material/Container';

const MyPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>마이페이지</title>
        <meta name="description" content="Generate by elice Team 5" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Container>
          <MyPageComponent />
        </Container>
      </Layout>
    </>
  );
};

export default MyPage;
