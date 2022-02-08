import type {
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next';
import MyPageNickName from '@components/mypage/MyPageNickname';
import MyPagePassword from '@components/mypage/MyPagePassword';
import MyPageMorePost from '@components/mypage/MyPageMorePost';

const ChangePage: NextPage = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  switch (data.type) {
    case 'nickname':
      return <MyPageNickName />;
    case 'password':
      return <MyPagePassword />;
    case 'posts':
      return <MyPageMorePost />;
    default:
      return <></>;
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { type } = context.query;

  if (type !== 'password' && type !== 'nickname' && type !== 'posts') {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }

  const data = { type: type };
  return {
    props: { data },
  };
};

export default ChangePage;
