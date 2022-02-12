import CommentList from '@components/comment/CommentList';
import CommentLogin from '@components/comment/CommentLogin';
import CommentEditor from '@components/comment/CommentEditor';
import CommentSum from '@components/comment/CommentSum';
import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { RootReducer } from '@store/reducer';

const Hr = styled.hr`
  border-top: 0px;
  border-bottom: 1px solid #8946a6;
  margin-bottom: 20px;
`;

type CommentProps = {
  id: string;
};

const Comment: React.FC<CommentProps> = ({ id }) => {
  const [sum, setSum] = useState<number>(0);

  const userId = useSelector((state: RootReducer) => state.user.user.id);

  return (
    <section>
      <Container>
        <CommentSum sum={sum} />
      </Container>
      <Hr></Hr>
      <Container>
        <CommentList setSum={setSum} postId={id} userId={userId} />
        {userId ? <CommentEditor postId={id} /> : <CommentLogin />}
      </Container>
    </section>
  );
};

export default Comment;
