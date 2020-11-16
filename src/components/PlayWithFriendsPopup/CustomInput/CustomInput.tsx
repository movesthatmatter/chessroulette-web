import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';

type Props = Omit<
React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
'onChange'
> & {
  value: string;
  onChange: (value: string) => void;
};

export const CustomInput: React.FC<Props> = ({
  onChange,
  value,
  className,
  ...inputProps
}) => {
  const cls = useStyle();

  const inputChangeHandler = (nextValue: string) => {
    if (nextValue === ' ' || !checkInputValidity(nextValue)) {
      return;
    }

    onChange(nextValue);
  };

  return (
    <input
      type="text"
      value={value}
      className={cx(cls.inputElement, className)}
      maxLength={6}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => (
        inputChangeHandler(e.target.value)
      )}
      {...inputProps}
    />
  );
};

const checkInputValidity = (inputValue: string): boolean => {
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
    borderRadius: '3px',
    border: '2px solid #C8EEF7',
    boxSizing: 'border-box',
    fontSize: '18px',
    padding: '5px',
    outline: 'none',
    textAlign: 'center',
    margin: '0px 3px',
  },
});
