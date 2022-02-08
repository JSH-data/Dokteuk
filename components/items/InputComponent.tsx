import TextField from '@mui/material/TextField';

type inputProps = {
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  changeFn?: (value: string) => void;
};

const InputComponent: React.FC<inputProps> = ({
  type,
  placeholder,
  defaultValue,
  changeFn,
}) => {
  return (
    <>
      {!type ? (
        <TextField
          style={{ width: '85%' }}
          multiline
          maxRows={4}
          placeholder={placeholder ?? placeholder}
          value={defaultValue ?? defaultValue}
          onChange={(event) => changeFn?.(event.target.value)}
        />
      ) : (
        <TextField
          style={{ width: '100%' }}
          type={type}
          placeholder={placeholder ?? placeholder}
          value={defaultValue ?? defaultValue}
          onChange={(event) => changeFn?.(event.target.value)}
        />
      )}
    </>
  );
};

export default InputComponent;
