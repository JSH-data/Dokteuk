import type {
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next';
import MyPageNickName from '@components/mypage/MyPageNickname';
import MyPagePassword from '@components/mypage/MyPagePassword';
import MyPageMorePost from '@components/mypage/MyPageMorePost';
import wrapper from '@store/configureStore';

const ChangePage: NextPage = ({
  data,
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  switch (data) {
    case 'nickname':
      return <MyPageNickName userId={userId} />;

    case 'password':
      return <MyPagePassword />;

    case 'posts':
      return <MyPageMorePost userId={userId} />;

    default:
      return <></>;
  }
};

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (ctx) => {
    const { type } = ctx.query;
    if (type !== 'password' && type !== 'nickname' && type !== 'posts') {
      return {
        redirect: {
          destination: '/404',
          permanent: false,
        },
      };
    }

    const data = store.getState();
    console.log(data, '마이페이지 데이터');
    if (data.user.user.nickname == '') {
      return {
        redirect: {
          destination: '/404',
          permanent: false,
        },
      };
    }

    return {
      props: { data: type, userId: data.user.user.id },
    };
  });

export default ChangePage;
