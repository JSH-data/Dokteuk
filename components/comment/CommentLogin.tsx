import React from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';

const CommentLoginSection = styled.section`
  display: flex;
  flex-direction: column;
  & button {
    align-self: flex-end;
  }
`;

const CommentLogin: React.FC = () => {
  return (
    <CommentLoginSection>
      <h4>댓글 작성을 위해 로그인해주세요!</h4>
      <Link href={'/user/login'} passHref>
        <Button variant="contained" size="medium" color="secondary">
          로그인하기
        </Button>
      </Link>
    </CommentLoginSection>
  );
};

export default CommentLogin;
