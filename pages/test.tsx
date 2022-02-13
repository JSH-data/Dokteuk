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
import { useSelector } from 'react-redux';
import { RootReducer } from '@store/reducer';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@firebase/firebase';
import { useRouter } from 'next/router';

const Test: NextPage = () => {
  const router = useRouter();
  const { nickname, id, jobSector } = useSelector(
    (state: RootReducer) => state.user.user,
  );

  const counter = {
    nickname: '닉네임',
    id: '아이디',
    jobSector: '닉네임',
  };

  const chatOpen = async () => {
    const chatRoom = await addDoc(collection(db, 'chat'), {
      users: [
        { nickname: nickname, id: id, job: jobSector },
        { nickname: counter.nickname, id: counter.id, job: counter.jobSector },
      ],
      updatedAt: Timestamp.now(),
      lastChat: '',
      lastVisited: { [id]: Timestamp.now(), [counter.id]: Timestamp.now() },
      userIds: [id, counter.id],
    });
    // console.log({ [id]: Timestamp.now(), [counter.id]: Timestamp.now() });
    // console.log(chatRoom.id);
    router.push(`/chat/${chatRoom.id}`);
  };
  return (
    <div>
      <button
        onClick={() => {
          chatOpen();
        }}
      >
        채팅방 열기
      </button>
    </div>
  );
};
export default Test;
