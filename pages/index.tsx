import type { NextPage } from 'next';
import Head from 'next/head';
import Layout from '@layouts/Layout';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { TextField } from '@mui/material';
import styled from '@emotion/styled';
import useInputHook from 'hooks/useInputHook';
//import HomePost from '@components/HomePost';
import Link from 'next/link';
import { firebaseAdmin } from '@firebase/firebaseAdmin';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { UserState } from '@interface/StoreInterface';

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/list/timeline');
  }, [router]);
  return <div></div>;
};
export default Home;

// export const getServerSideProps = async () => {
//   // const fs = await require('fs');
//   // console.log(fs);
//   // console.log(
//   //   "process.browser in pages/index.tsx 's getServerSideProps",
//   //   process.browser,
//   // );
//   return { props: {} };
// };
