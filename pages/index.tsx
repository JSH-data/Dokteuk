import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/list/timeline');
  }, [router]);
  return <div></div>;
};
export default Home;
export const getServerSideProps = async () => {
  // const fs = await require('fs');
  // console.log(fs);
  // console.log(
  //   "process.browser in pages/index.tsx 's getServerSideProps",
  //   process.browser,
  // );
  return { props: {} };
};
