import React from 'react';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';

const CommentLoginSection = styled.section`
  display: flex;
  flex-direction: column;
  & button {
    align-self: flex-end;
  }
`;

type CommentLoginProps = {
  setIsLogin(isLogin: boolean): void;
};

const CommentLogin: React.FC<CommentLoginProps> = ({ setIsLogin }) => {
  return (
    <CommentLoginSection>
      <h4>답변을 위해 로그인해주세요!</h4>
      <Button
        onClick={() => setIsLogin(true)}
        variant="contained"
        size="medium"
        color="secondary"
      >
        로그인하기
      </Button>
    </CommentLoginSection>
  );
};

export default CommentLogin;
