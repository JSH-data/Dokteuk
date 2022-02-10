import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@layouts/Layout';
import Container from '@mui/material/Container';
import MyPagePost from './MyPagePost';

const postings = [
  {
    title: '게시물 제목 ',
    content: '게시물 내용 조금',
  },
  {
    title: '게시물 제목 ',
    content: '게시물 내용 조금',
  },
  {
    title: '게시물 제목 ',
    content: '게시물 내용 조금',
  },
  {
    title: '게시물 제목 ',
    content: '게시물 내용 조금',
  },
  {
    title: '게시물 제목 ',
    content: '게시물 내용 조금',
  },
  {
    title: '게시물 제목 ',
    content: '게시물 내용 조금',
  },
  {
    title: '게시물 제목 ',
    content: '게시물 내용 조금',
  },
  {
    title: '게시물 제목 ',
    content: '게시물 내용 조금',
  },
];

const MyPageMorePost: React.FC = () => {
  const { ref, inView } = useInView();
  const [posts, setPosts] = useState(postings);

  useEffect(() => {
    setPosts([...posts, ...postings]);
  }, [inView]);

  return (
    <>
      <Head>
        <title>작성한 게시물</title>
        <meta name="description" content="Generate by elice Team 5" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Container>
          <article>
            <header style={{ display: 'flex', alignItems: 'center' }}>
              <Link href={'/mypage'}>
                <span style={{ marginRight: '20px' }}>{'<'}</span>
              </Link>
              <h1>내가 작성한 게시물</h1>
            </header>

            {posts.map((post, idx) => (
              <>
                {posts.length - 1 == idx ? (
                  <MyPagePost
                    key={idx}
                    title={post.title}
                    content={post.content}
                    refObj={ref}
                  ></MyPagePost>
                ) : (
                  <MyPagePost
                    key={idx}
                    title={post.title}
                    content={post.content}
                  />
                )}
              </>
            ))}
          </article>
        </Container>
      </Layout>
    </>
  );
};

export default MyPageMorePost;
