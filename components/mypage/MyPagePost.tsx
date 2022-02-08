import styled from '@emotion/styled';

type MyPagePost = {
  title: string;
  content: string;
  refObj?: any;
};

const MyPagePostLi = styled.li`
  width: 80%;
  margin: 0 auto;
  border-bottom: 1px solid #8946a6;
  padding-bottom: 10px;
  list-style: none;
  & span {
    color: #ea99d5;
  }
  & h4 {
    margin-bottom: 10px;
  }
`;

const MyPagePost: React.FC<MyPagePost> = ({ title, content, refObj }) => {
  return (
    <MyPagePostLi>
      <h4 ref={refObj}>{title}</h4>
      <span>{content}</span>
    </MyPagePostLi>
  );
};

export default MyPagePost;
