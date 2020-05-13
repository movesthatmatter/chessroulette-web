import React, { useState } from 'react';
import { createUseStyles } from 'src/lib/jss';

type Props = {
  onChange: (value: string) => void;
};

export const CustomInput: React.FC<Props> = ({ onChange }) => {
  const cls = useStyle();
  const [inputValue, setInputValue] = useState('');

  const inputChangeHandler = (value: string) => {
    if (value === ' ' || !checkInputValidity(value)) {
      return;
    }
    setInputValue(value);
    onChange(value);
  };
  const keyDownHandler = (key: number) => {
    if (((key === 8) || (key === 46)) && (inputValue.length === 1)) {
      setInputValue('');
    }
  };
  return (
    <>
      <input
        type="text"
        value={inputValue}
        className={cls.inputElement}
        maxLength={6}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => (
          inputChangeHandler(e.target.value)
        )}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => (
          keyDownHandler(e.keyCode)
        )}
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
    backgroundColor: '#C8EEF7',
    color: '#8e99a4',
    borderRadius: '8px',
    border: '2px solid #C8EEF7',
    boxSizing: 'border-box',
    fontSize: '18px',
    padding: '5px',
    outline: 'none',
    fontFamily: 'Roboto',
    textAlign: 'center',
    margin: '0px 3px',
  },
});
