import MyPagePost from './MyPagePost';
import { useEffect, useState } from 'react';
import { MyPageProfileComponent } from './MyPageProfileComponent';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@firebase/firebase';

type MyPagePostListProps = {
  userId: string;
};

const MyPagePostList: React.FC<MyPagePostListProps> = ({ userId }) => {
  const [posts, setPosts] = useState<any>([]);
  useEffect(() => {
    const getMyPost = async (userId: string) => {
      const q = query(
        collection(db, 'post'),
        where('userId', '==', userId),
        limit(5),
      );
      const querySnapshot = await getDocs(q);
      const myPost: any = [];
      querySnapshot.forEach((doc) => {
        myPost.push(doc.data());
      });
      setPosts([...myPost]);
    };
    getMyPost(userId);
  }, []);
  return (
    <MyPageProfileComponent>
      <h1>내가 작성한 게시물</h1>
      <ul>
        {posts.map((post: any, idx: number) => {
          return (
            <MyPagePost key={idx} title={post.title} content={post.content} />
          );
        })}
      </ul>
    </MyPageProfileComponent>
  );
};

export default MyPagePostList;
