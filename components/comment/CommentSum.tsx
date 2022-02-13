import styled from '@emotion/styled';

const CommentHeader = styled.h1`
  display: flex;
  width: 80%;
  align-items: flex-end;
  & span {
    font-weight: 300;
    font-size: 1.2rem;
  }
  margin-bottom: 10px;
`;

type CommentSumProps = {
  sum: number;
};

const CommentSum: React.FC<CommentSumProps> = ({ sum }) => {
  return (
    <>
      <CommentHeader>
        {sum}
        <span>{` `}개의 답변</span>
      </CommentHeader>
    </>
  );
};

export default CommentSum;
