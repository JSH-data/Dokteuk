// import type { NextPage } from 'next';
// import { doc, updateDoc } from 'firebase/firestore';
// import { db } from '@firebase/firebase';
// // import type { RootReducer } from 'store/reducer';
// import { useSelector } from 'react-redux';
// import { RootReducer } from 'store/reducer';

// const Test: NextPage = () => {
//   const { user }: any = useSelector((state: RootReducer) => state.user);
//   console.log(user);
//   const update = () => {
//     const userRef = doc(db, 'user', 'dBEEX25SN6e5f6Zcb9CFU3xnLyI3');

//     updateDoc(userRef, {
//       nickname: 'asdasdasd',
//     });
//   };

//   return <div onClick={update}>{user.nickname}여기 sdasd눌러</div>;
// };
// export default Test;
import type { NextPage } from 'next';
import Comment from '@components/comment/Comment';
import { useState } from 'react';

const Test: NextPage = () => {
  return <Comment id="0oGtTqPmk7wS4Zisc7Iys"></Comment>;
};
export default Test;
