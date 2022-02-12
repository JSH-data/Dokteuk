import React from 'react';
import styled from '@emotion/styled';
import { getDateTime } from '@utils/function';

const CommentAuthorDiv = styled.div`
  margin-bottom: 25px;
  display: flex;
  justify-content: space-between;
`;

const CommentCompany = styled.span``;

const CommentNickname = styled.span`
  color: grey;
  font-size: 0.8rem;
`;

type authorProps = {
  nickname: string;
  job: string;
  date: string;
};

const CommentAuthorComponent: React.FC<authorProps> = ({
  date,
  nickname,
  job,
}) => {
  return (
    <CommentAuthorDiv>
      <div>{getDateTime(date)}</div>
      <div>
        <CommentNickname>{nickname}</CommentNickname>

        {`  `}

        <CommentCompany>{job}</CommentCompany>
      </div>
    </CommentAuthorDiv>
  );
};

export default CommentAuthorComponent;
