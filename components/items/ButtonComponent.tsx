import styled from '@emotion/styled';
import Button from '@mui/material/Button';

const ButtonStyled = styled(Button)`
  margin-left: 10px;
  background: ${({ theme }: any) => theme.mainColorViolet};

  :hover {
    opacity: 0.8;
    background: ${({ theme }: any) => theme.mainColorViolet};
  }

  @media (prefers-color-scheme: dark) {
    background: ${({ theme }: any) => theme.mainColorBlue};

    :hover {
      opacity: 0.8;
      background: ${({ theme }: any) => theme.mainColorBlue};
    }
  }
`;

type ButtonProps = {
  text: string;
  activeFn: () => void;
};

const ButtonComponent: React.FC<ButtonProps> = ({ text, activeFn }) => {
  return (
    <ButtonStyled variant="contained" size="medium" onClick={activeFn}>
      {text}
    </ButtonStyled>
  );
};

export default ButtonComponent;
