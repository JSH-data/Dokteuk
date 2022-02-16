import styled from '@emotion/styled';
import Link from 'next/link';

type MyPagePost = {
  title: string;
  content: string;
  postId: string;
  postType: string;
  url: any;
  // refObj?: any;
};

const MyPagePostLi = styled.li`
  width: 80%;
  margin: 0 auto;
  border-bottom: 1px solid #8946a6;
  padding-bottom: 10px;
  list-style: none;
  text-overflow: ellipsis;
  & div {
    width: 90%;
    color: #ea99d5;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  & h4 {
    margin-bottom: 10px;
  }
`;

const MyPagePost: React.FC<MyPagePost> = ({
  title,
  content,
  postId,
  postType,
  url,
}) => {
  return (
    <Link href={`/list/${postType}/${url.url}/${postId}`}>
      <MyPagePostLi>
        <h4>{title}</h4>
        <div>{content}</div>
      </MyPagePostLi>
    </Link>
  );
};

export default MyPagePost;
