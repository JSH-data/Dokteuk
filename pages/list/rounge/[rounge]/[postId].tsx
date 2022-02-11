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
        url: context.req.url,
      },
    };
  return { props: {} };
};

export default function RoungePost({
  referer,
  url,
}: {
  referer: string | undefined;
  url: string;
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (
      !(
        referer &&
        referer.split('/').length === 2 &&
        referer.split('/')[0] === 'list' &&
        url
      )
    ) {
      dispatch(setScrollAction(0));
    }
  }, []);
  return <div>1234123412341234123412341234123412341234</div>;
}
