import CommentList from '@components/comment/CommentList';
import CommentLogin from '@components/comment/CommentLogin';
import CommentEditor from '@components/comment/CommentEditor';
import CommentSum from '@components/comment/CommentSum';
import Container from '@mui/material/Container';
import { useState } from 'react';

import styled from '@emotion/styled';

const Hr = styled.hr`
  border-top: 0px;
  border-bottom: 1px solid #8946a6;
  margin-bottom: 20px;
`;

export default function Comment() {
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const [sum, setSum] = useState<number>(0);

  return (
    <section>
      <Container>
        <CommentSum sum={sum} />
      </Container>
      <Hr></Hr>
      <Container>
        <CommentList setSum={setSum} />
        {isLogin ? <CommentEditor /> : <CommentLogin setIsLogin={setIsLogin} />}
      </Container>
    </section>
  );
}
