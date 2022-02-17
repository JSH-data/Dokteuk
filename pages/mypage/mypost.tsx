import type { NextPage } from 'next';
import Head from 'next/head';
import Layout from '@layouts/Layout';
import Container from '@mui/material/Container';
import { MyPageChangeCom } from '@components/mypage/MyPageChangeComponent';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import useGetMyPost from '@hooks/useGetMyPost';
import { useEffect } from 'react';
import MyPagePost from '@components/mypage/MyPagePost';
import { LoadingDiv } from '@components/items/LoadingDiv';

const MyPost: NextPage = () => {
  const { ref, inView } = useInView();
  const { data, key, stopFetch, getMorePosts } = useGetMyPost();

  useEffect(() => {
    if (
      inView === true &&
      stopFetch === false &&
      data.length >= 2 &&
      key == 'mypost'
    ) {
      getMorePosts(data.length);
    }
  }, [inView]);

  if (!data[0]?.title) {
    return (
      <Layout>
        <Container>
          <MyPageChangeCom>
            <header style={{ marginBottom: '2rem' }}>
              <Link href={'/mypage'} passHref>
                <ArrowBackIosNewIcon />
              </Link>
              <h1>내가 작성한 게시물</h1>
            </header>
          </MyPageChangeCom>
        </Container>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>작성한 게시물</title>
        <meta name="description" content="Generate by elice Team 5" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Container>
          <MyPageChangeCom>
            <header style={{ marginBottom: '2rem' }}>
              <Link href={'/mypage'} passHref>
                <ArrowBackIosNewIcon />
              </Link>
              <h1>내가 작성한 게시물</h1>
            </header>
            {data.length !== 0 &&
              data.map((v: any) => (
                <MyPagePost
                  key={v.postId}
                  title={v.title}
                  postId={v.postId}
                  content={v.content}
                  postType={v.postType}
                  url={v.url}
                />
              ))}
            <div ref={ref}></div>
          </MyPageChangeCom>
        </Container>
      </Layout>
    </>
  );
};

export default MyPost;
