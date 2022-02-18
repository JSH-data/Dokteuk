import styled from '@emotion/styled';

const Empty = ({ ment }: { ment: string }) => {
  return (
    <EmptyWrapper>
      <div>{ment}</div>
    </EmptyWrapper>
  );
};

export default Empty;

export const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 680px;
  height: 80px;
  text-align: center;
  margin: 20px auto;
  border-radius: 10px;
  background: white;

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) => theme.mainColorBlack};
  }
`;
