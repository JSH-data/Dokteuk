import styled from '@emotion/styled';
export const MyPageProfileComponent = styled.article`
  margin-top: 2rem;
  border-radius: 15px;
  padding: 70px 40px 30px 40px;
  margin-top: 40px;
  & header {
    display: flex;
    margin-bottom: 5.5rem;
    align-items: end;
  }
  & header > div > #nickname {
    font-weight: bold;
    font-size: 1.3rem;
  }
  & header > svg {
    margin-right: 1rem;
  }
  & header > div > #email {
    font-size: 0.8rem;
    opacity: 0.8;
  }

  background-color: ${({ theme }: any) =>
    theme.customTheme.defaultMode.cardWrapperBackgroundColor};
  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }: any) =>
      theme.customTheme.darkMode.cardWrapperBackgroundColor};
  }
`;
