import React, { useCallback, useState } from 'react';

// (string | Dispatch<SetStateAction<string>> | ((e: React.ChangeEvent<HTMLInputElement>) => void) | undefined)[]
type onChangeType = (e: React.ChangeEvent<HTMLInputElement>) => void;
type setStateType = React.Dispatch<React.SetStateAction<string>>;
export default function (initialValue: string) {
  const [state, setState] = useState(initialValue);
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setState(e.target.value);
  }, []);
  return [state, setState, onChange] as unknown as [
    string,
    setStateType,
    onChangeType,
  ];
}
