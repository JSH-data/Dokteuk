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
import InputComponent from '@components/items/InputComponent';
import { useState } from 'react';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@firebase/firebase';

const Test: NextPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <>
      <InputComponent changeFn={setTitle} />
      <InputComponent changeFn={setContent} />
      <button
        onClick={async () => {
          const timeStamp = new Date();
          const detailTimeStamp = timeStamp.getTime();
          await addDoc(collection(db, 'post'), {
            userId: 't86KPfYScWfiVyg76XRgmWMGbMf2',
            content,
            title,
            timestamp: detailTimeStamp,
          });
        }}
      >
        게시물 만들기
      </button>
    </>
  );
};
export default Test;
