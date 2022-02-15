import Button from '@mui/material/Button';

type ButtonProps = {
  text: string;
  activeFn: () => void;
};

const ButtonComponent: React.FC<ButtonProps> = ({ text, activeFn }) => {
  return (
    <Button
      variant="contained"
      size="medium"
      color="secondary"
      onClick={activeFn}
    >
      {text}
    </Button>
  );
};

export default ButtonComponent;
