import React, { useState } from 'react';
import { getStorage } from 'firebase/storage';
import fetch from 'isomorphic-unfetch';
import { InferGetServerSidePropsType } from 'next';
import axios from 'axios';

export default function Test() {
  const MY_OCR_API_URL = '';
  const MY_OCR_SECRET_KEY = '';

  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'X-OCR-SECRET': MY_OCR_SECRET_KEY,
    },
  };

  const timestamp = new Date().getTime();
  const sumText = '';
}
// export default function Test({ result }: { result: string }) {
//   return (
//     <>
//       <form>result</form>
//     </>
//   );
// }

// export async function getServerSideProps(context) {
//   console.log('server side');
//   return {
//     props: { result: 'asdasd' },
//   };
// }
