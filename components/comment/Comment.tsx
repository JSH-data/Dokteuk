import CommentList from '@components/comment/CommentList';
import CommentLogin from '@components/comment/CommentLogin';
import CommentEditor from '@components/comment/CommentEditor';
import CommentSum from '@components/comment/CommentSum';
import Container from '@mui/material/Container';
import { useState } from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { RootReducer } from '@store/reducer';
import { PostData } from '@interface/comment';

const Hr = styled.hr`
  border-top: 0px;
  border-bottom: 1px solid ${({ theme }: any) => theme.mainColorViolet};
  margin-bottom: 20px;

  @media (prefers-color-scheme: dark) {
    border-bottom: 1px solid ${({ theme }: any) => theme.mainColorBlue};
  }
`;

const Comment = ({ postData }: { postData: PostData }) => {
  const [sum, setSum] = useState<number>(0);

  const userId = useSelector((state: RootReducer) => state.user.user.id);

  return (
    <section style={{ paddingBottom: '50px' }}>
      <Container>
        <CommentSum sum={sum} postId={postData.id} />
      </Container>
      <Hr></Hr>
      <Container>
        <CommentList setSum={setSum} userId={userId} postData={postData} />
        {userId ? <CommentEditor postData={postData} /> : <CommentLogin />}
      </Container>
    </section>
  );
};

export default Comment;
