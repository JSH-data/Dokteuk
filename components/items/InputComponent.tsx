import TextField from '@mui/material/TextField';

type inputProps = {
  placeholder?: string;
  defaultValue?: string;
  changeFn?: (value: string) => void;
  type: string;
  error: boolean;
  errorText: string;
};

const InputComponent: React.FC<inputProps> = ({
  placeholder,
  defaultValue,
  changeFn,
  type,
  error,
  errorText,
}) => {
  return (
    <TextField
      style={{ width: '100%' }}
      type={type}
      placeholder={placeholder ?? placeholder}
      value={defaultValue ?? defaultValue}
      onChange={(event) => changeFn?.(event.target.value)}
      error={error}
      helperText={errorText}
      sx={{ input: { backgroundColor: 'white' } }}
      margin="normal"
      focused={false}
      inputProps={{
        autoComplete: 'new-password',
      }}
    />
  );
};

export default InputComponent;
