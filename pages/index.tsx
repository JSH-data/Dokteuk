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
