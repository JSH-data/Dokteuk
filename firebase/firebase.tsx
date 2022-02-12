import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
import * as firebase from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  browserSessionPersistence,
} from 'firebase/auth';

import { getStorage, ref } from 'firebase/storage';
import 'firebase/storage';
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
export const provider = new GoogleAuthProvider();
export const commentRef = collection(db, 'comment');
export { firebase };
export const storage = getStorage(app);
