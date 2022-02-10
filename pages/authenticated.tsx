import React from 'react';
import nookies from 'nookies';
import { useRouter } from 'next/router';
import { firebaseAdmin } from '@firebase/firebaseAdmin';
import { firebase } from '@firebase/firebaseClient';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@firebase/firebase';

import { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next';

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    //console.log(JSON.stringify(cookies, null, 2));
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    const { uid, email } = token;
    console.log(token);

    // {
    //   iss: 'https://securetoken.google.com/devily-test',
    //   aud: 'devily-test',
    //   auth_time: 1644329781,
    //   user_id: 'dBEEX25SN6e5f6Zcb9CFU3xnLyI3',
    //   sub: 'dBEEX25SN6e5f6Zcb9CFU3xnLyI3',
    //   iat: 1644329781,
    //   exp: 1644333381,
    //   email: 'asd@test.com',
    //   email_verified: false,
    //   firebase: { identities: { email: [Array] }, sign_in_provider: 'password' },
    //   uid: 'dBEEX25SN6e5f6Zcb9CFU3xnLyI3'
    // }

    // the user is authenticated!
    // FETCH STUFF HERE

    return {
      props: {
        message: `Your email is ${email} and your UID is ${uid} token is ${cookies.token}`,
      },
    };
  } catch (err) {
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    return {
      redirect: {
        permanent: false,
        destination: '/user/login',
      },
      // `as never` is required for correct type inference
      // by InferGetServerSidePropsType below
      props: {} as never,
    };
  }
};

function AuthenticatedPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const router = useRouter();

  return (
    <div>
      <p>{props.message!}</p>
      <button
        onClick={async () => {
          await signOut(auth).then(() => {
            router.push('/');
          });
        }}
      >
        Sign out
      </button>
    </div>
  );
}

export default AuthenticatedPage;
