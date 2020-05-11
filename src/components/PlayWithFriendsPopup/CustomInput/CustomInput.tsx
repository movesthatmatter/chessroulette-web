import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';

type Props = {
  inputChanged: (value: string) => void;
};

export const CustomInput = ({ inputChanged }: Props) => {
  const cls = useStyle();
  const [inputValue, setInputValue] = useState('');
  const inputChangeHandler = (value: string) => {
    if (checkInputValidity(value)) {
      setInputValue(value);
      inputChanged(value);
    }
  };
  const keyHandler = (value: number) => {
    if (value === 8 || value === 46) {
      setInputValue('');
    }
  };
  return (
    <>
      <input
        type="text"
        id="input1"
        value={inputValue}
        className={cls.inputElement}
        maxLength={1}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => inputChangeHandler(e.target.value)}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => keyHandler(e.keyCode)}
      />
    </>
  );
};
export const checkInputValidity = (inputValue: string): boolean => {
  if (!inputValue) {
    return false;
  }
  const pattern = /^[a-zA-Z0-9\s]*$/;
  return pattern.test(inputValue);
};
const useStyle = createUseStyles({
  inputElement: {
    backgroundColor: '#f1f3f4',
    color: '#8e99a4',
    borderRadius: '8px',
    width: '33px',
    border: '2px solid #f1f3f4',
    boxSizing: 'border-box',
    fontSize: '18px',
    padding: '5px',
    outline: 'none',
    fontFamily: 'Roboto',
    textAlign: 'center',
    margin: '0px 3px',
  },
});
