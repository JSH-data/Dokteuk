import Head from 'next/head';
import '../styles/globals.css';
import type { AppContext, AppProps } from 'next/app';
import AuthProvider from './user/auth';
import nookies from 'nookies';
import fetch from 'isomorphic-unfetch';
import wrapper from 'store/configureStore';
import { getUser } from 'store/reducer';
import ThemeProviderStyle from '@styles/ThemeProviderStyle';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@firebase/firebase';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootReducer } from 'store/reducer';
import { setNewUserInfo } from 'store/reducer';
import { UserInfo, UserState } from '@interface/StoreInterface';

function MyApp({ Component, pageProps }: AppProps) {
  const dispatch = useDispatch();
  const { user }: UserState = useSelector((state: RootReducer) => state.user);

  useEffect(() => {
    if (user.id) {
      onSnapshot(doc(db, 'user', user.id), (doc) => {
        const data = doc.data() as UserInfo;

        const userData: UserInfo = { ...data, id: doc.id };
        dispatch(setNewUserInfo(userData));
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>DokTeuk</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no, shrink-to-fit=no "
        />
      </Head>
      <AuthProvider>
        <ThemeProviderStyle>
          <Component {...pageProps} />
        </ThemeProviderStyle>
      </AuthProvider>
    </>
  );
}

MyApp.getInitialProps = wrapper.getInitialAppProps(
  (store) =>
    async ({ Component, ctx }: AppContext): Promise<any> => {
      if (typeof window === 'undefined') {
        const { token } = nookies.get(ctx);

        if (token) {
          try {
            const headers: HeadersInit = {
              'Content-Type': 'application/json',
              Authorization: JSON.stringify({
                token: token,
              }),
            };

            const {
              data: { userData, uid: id, email },
            }: {
              data: {
                uid: string;
                email: string;
                userData: Omit<UserInfo, 'email' | 'id'>;
              };
            } = await fetch(
              `http://localhost:${
                process.env.NODE_ENV !== 'production' ? 5000 : 80
              }/api/validate`,
              {
                headers,
              },
            ).then((res) => res.json());
            console.log(id);
            const data: UserInfo = {
              ...userData,
              id,
              email,
            };
            await store.dispatch(getUser(data));
          } catch (e) {
            console.error(e);
          }
        }
      }
    },
);
export default wrapper.withRedux(MyApp);
