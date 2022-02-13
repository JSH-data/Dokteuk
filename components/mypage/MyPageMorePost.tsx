import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@layouts/Layout';
import Container from '@mui/material/Container';
import MyPagePost from './MyPagePost';
import { MyPageChangeCom } from './MyPageChangeComponent';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '@firebase/firebase';

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

interface Post {
  title: string;
  content: string;
}

type MyPageMorePostProp = {
  userId: string;
};

const MyPageMorePost: React.FC<MyPageMorePostProp> = ({ userId }) => {
  const { ref, inView } = useInView();
  const [posts, setPosts] = useState<Post[]>([]);
  const [stopFetch, setStopFetch] = useState<boolean>(false);
  const [firstFetch, setFirstFetch] = useState<boolean>(true);

  const [end, setEnd] = useState<any>(0);

  const getPosts = async () => {
    let q;

    if (firstFetch) {
      q = query(
        collection(db, 'post'),
        where('userId', '==', `${userId}`),
        orderBy('timestamp', 'asc'),
        limit(10),
      );
    } else {
      q = query(
        collection(db, 'post'),
        where('userId', '==', `${userId}`),
        orderBy('timestamp', 'asc'),
        limit(10),
        startAfter(end),
      );
    }

    const snapshots = await getDocs(q);
    const dataArr: Post[] = [];
    snapshots.forEach((snapshot) => {
      dataArr.push(snapshot.data() as Post);
    });

    if (dataArr.length < 10) setStopFetch(true);

    setPosts([...posts, ...dataArr]);

    setEnd(snapshots.docs[snapshots.docs.length - 1]);
  };

  useEffect(() => {
    setFirstFetch(false);
    getPosts();
  }, []);

  useEffect(() => {
    if (inView === true && firstFetch === false && stopFetch === false) {
      getPosts();
    }
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
          <MyPageChangeCom>
            <header style={{ marginBottom: '2rem' }}>
              <Link href={'/mypage'}>
                <ArrowBackIosNewIcon />
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
          </MyPageChangeCom>
        </Container>
      </Layout>
    </>
  );
};

export default MyPageMorePost;
