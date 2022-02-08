import MyPagePost from './MyPagePost';
import { MyPageListComponent } from './MyPageListComponent';

const postings = [
  {
    title: '게시물 제목 ',
    content: '게시물 내용 조금',
  },
  {
    title: '게시물 제목 ',
    content: '게시물 내용 조금',
  },
  {
    title: '게시물 제목 ',
    content: '게시물 내용 조금',
  },
  {
    title: '게시물 제목 ',
    content: '게시물 내용 조금',
  },
  {
    title: '게시물 제목 ',
    content: '게시물 내용 조금',
  },
];

const MyPagePostList: React.FC = () => {
  return (
    <MyPageListComponent>
      <h1>내가 작성한 게시물</h1>
      <ul>
        {postings.map((post, idx) => {
          return (
            <MyPagePost key={idx} title={post.title} content={post.content} />
          );
        })}
      </ul>
    </MyPageListComponent>
  );
};

export default MyPagePostList;
