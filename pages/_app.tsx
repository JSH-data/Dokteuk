import Head from 'next/head';
import '../styles/globals.css';
import type { AppContext, AppProps } from 'next/app';
import AuthProvider from './user/auth';
import nookies from 'nookies';
import fetch from 'isomorphic-unfetch';
import wrapper from 'store/configureStore';
import { getUser } from 'store/reducer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
// import { AuthProvider } from '@hooks/Auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@firebase/firebase';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootReducer } from 'store/reducer';
import { userSlice } from 'store/reducer';
import { setNewUserInfo } from 'store/reducer';
import { UserInfo, UserState } from '@interface/StoreInterface';

const theme_ = createTheme(
  {},
  {
    customTheme: {
      defaultMode: {
        headerMenuBackgroundColor: '#8946A6',
        footerMenuBackgroundColor: '#8946A6',
        inCardRoungeColor: '#4C78C1',
        swiperSlideTextColor: 'rgba(200, 200, 200, 0.75)',
        cardWrapperBackgroundColor: 'white',
        topicWrapperBackgroundColor: '#8946A6',
        topicWrapperTextColor: 'black',
        footerIconColor: 'white',
        footerWriteIconBackgroundColor: '#9165e2',
        searchInputBackgroundColor: 'white',
        searchInputTextColor: 'black',
        searchPageWrapperBackgroundColor: '#EAEAEA',
        searchWrapperBorderBottomColor: '#EAEAEA',
        footerBordertopColor: '#EAEAEA',
        chatFromBackgroundColor: '#f0f0f0',
        chatToBackgroundColor: '#b762c1',
      },
      darkMode: {
        headerMenuBackgroundColor: 'rgba(28, 28, 30, 1)',
        footerMenuBackgroundColor: 'rgba(28, 28, 30, 1)',
        inCardRoungeColor: '#4C78C1',
        swiperSlideTextColor: 'rgba(93, 93, 95, 0.9)',
        cardWrapperBackgroundColor: 'rgba(28, 28, 30, 1)',
        topicWrapperBackgroundColor: 'rgba(35, 35, 37, 1)',
        topicWrapperTextColor: 'rgba(213,213,215,0.85)',
        footerIconColor: 'rgb(145, 145, 146)',
        footerWriteIconBackgroundColor: 'rgba(219,50,57,1)',
        searchInputBackgroundColor: 'rgb(39, 39, 41)',
        searchInputTextColor: 'rgb(149, 149, 151)',
        searchPageWrapperBackgroundColor: 'rgba(28, 28, 30, 1)',
        searchWrapperBorderBottomColor: 'rgb(17, 17, 19)',
        footerBordertopColor: 'rgb(17, 17, 19)',
        chatFromBackgroundColor: 'rgba(35, 35, 37, 1)',
        chatToBackgroundColor: '#4C78C1',
      },
    },
  },
);
function MyApp({ Component, pageProps }: AppProps) {
  // console.log(process.browser);
  const dispatch = useDispatch();
  const { user }: UserState = useSelector((state: RootReducer) => state.user);

  useEffect(() => {
    if (user.id) {
      onSnapshot(doc(db, 'user', user.id), (doc) => {
        const data = doc.data() as UserInfo;
        // const userData: UserInfo = {
        //   nickname: data.nickname,
        //   jobSector: data.jobSector,
        //   validRounges: data.validRounges,
        //   email: data.email,
        //   hasNewNotification: data.hasNewNotification,
        //   id: doc.id,
        //   posts: data.posts,
        // };
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
        <ThemeProvider theme={theme_}>
          <Component {...pageProps} />
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}

MyApp.getInitialProps = wrapper.getInitialAppProps(
  (store) =>
    async ({ Component, ctx }: AppContext): Promise<any> => {
      // only run on server-side, user should be auth'd if on client-side
      if (typeof window === 'undefined') {
        const { token } = nookies.get(ctx);

        // if a token was found, try to do SSA
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
            } = await fetch('http://localhost:3000/api/validate', {
              headers,
            }).then((res) => res.json());

            const data: UserInfo = {
              ...userData,
              id,
              email,
            };
            // console.log(result, 'dlrj?');
            // const data = {
            //   nickname: result.data.userData.nickname,
            //   jobSector: result.data.userData.jobSector,
            //   validRounges: result.data.userData.validRounges,
            //   myChattings: [],
            //   id: result.data.uid,
            //   hasNewNotification: result.data.userData.notification,
            //   email: result.data.email,
            // };

            await store.dispatch(getUser(data));
          } catch (e) {
            console.error(e);
            // let exceptions fail silently
            // could be invalid token, just let client-side deal with that
          }
        }
      }
    },
);
export default wrapper.withRedux(MyApp);

// MyApp.getInitialProps = async (appContext: AppContext) => {
//   //   console.log('=============================');
//   //   // //const cookie = nookies.get(ctx);
//   //   // //console.log('cookies', cookie.token);
//   //   console.log('token', ctx.req.cookies.token);
//   //   const token = await firebaseAdmin.auth().verifyIdToken(ctx.req.cookies.token);
//   //   // // console.log(token);
//   const { ctx } = appContext;
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   //const appProps = await App.getInitialProps(appContext);

//   // only run on server-side, user should be auth'd if on client-side
//   //if (typeof window === 'undefined') {
//   const { token } = nookies.get(ctx);
//   // console.log('token', token);

//   // if a token was found, try to do SSA
//   if (token) {
//     try {
//       const headers: HeadersInit = {
//         'Content-Type': 'application/json',
//         Authorization: JSON.stringify({
//           token: token,
//         }),
//       };
//       // const result = await fetch('http://localhost:3000/api/validate', {
//       //   headers,
//       // });
//       const result = await fetch('http://localhost:3000/api/validate', {
//         headers,
//       }).then((res) => res.json());
//       // console.log('result', result);
//       console.log('result', result);
//     } catch (e) {
//       // let exceptions fail silently
//       // could be invalid token, just let client-side deal with that
//     }
//   }

//   return { pageProps: {} };
// };

// export default MyApp;
