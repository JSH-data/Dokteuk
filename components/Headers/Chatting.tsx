import styled from '@emotion/styled';

const ChattingWrapperDivStyled = styled.div`
  background-color: ${({ theme }: any) => theme.mainColorViolet};
  height: 60px;
  width: 100%;

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) => theme.mainColorBlack};
  }
`;

const ChattingTitle = styled.div`
  text-align: center;
  line-height: 60px;
  color: white;
  font-weight: bold;
`;

const HeaderChatting: React.FC = () => {
  return (
    <>
      <ChattingWrapperDivStyled>
        <ChattingTitle>대화</ChattingTitle>
      </ChattingWrapperDivStyled>
    </>
  );
};
export default HeaderChatting;
