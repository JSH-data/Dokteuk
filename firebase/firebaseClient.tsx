import * as firebase from 'firebase/app';
import {
  browserSessionPersistence,
  getAuth,
  Persistence,
  setPersistence,
} from 'firebase/auth';

if (typeof window !== 'undefined' && !firebase.getApp.length) {
  firebase.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    databaseURL: 'https://devily-test-default-rtdb.firebaseio.com',
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
  });
  getAuth().setPersistence(browserSessionPersistence);
}

export { firebase };