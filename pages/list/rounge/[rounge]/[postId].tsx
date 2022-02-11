import { setScrollAction } from '@store/reducer';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  if (context.req.headers.referer && context.req.url)
    return {
      props: {
        referer: context.req.headers.referer
          .split('/')
          .slice(3, context.req.headers.referer.split('/').length)
          .join('/'),
      },
    };
  return { props: {} };
};

export default function RoungePost({
  referer,
}: {
  referer: string | undefined;
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    // search에서의 접속은 referer가 search이다.
    if (
      !(
        (
          referer && // 이전 페이지 정보가 존재할 것
          referer.split('/').length === 2 && // 2인 경우는 list/* 에서 온 경우
          referer.split('/')[0] === 'list'
        ) // [0]가 list인지 확인
      ) &&
      referer !== 'search'
    ) {
      dispatch(setScrollAction(0));
    }
  }, []);
  return <div>1234123412341234123412341234123412341234</div>;
}
