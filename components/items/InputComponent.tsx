import TextField from '@mui/material/TextField';

type inputProps = {
  placeholder?: string;
  defaultValue?: string;
  changeFn?: (value: string) => void;
};

const InputComponent: React.FC<inputProps> = ({
  placeholder,
  defaultValue,
  changeFn,
}) => {
  return (
    <TextField
      style={{ width: '85%' }}
      multiline
      maxRows={4}
      placeholder={placeholder ?? placeholder}
      value={defaultValue ?? defaultValue}
      onChange={(event) => changeFn?.(event.target.value)}
    />
  );
};

export default InputComponent;
