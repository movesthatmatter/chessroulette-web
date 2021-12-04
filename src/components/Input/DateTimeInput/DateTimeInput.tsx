import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { TextInput, TextInputProps } from 'src/components/TextInput';
import { ISODateTime } from 'src/lib/date/ISODateTime';

export type DateTimeInputProps = Omit<TextInputProps, 'type'> & {
  min?: ISODateTime;
  max?: ISODateTime;
};

export const DateTimeInput: React.FC<DateTimeInputProps> = ({ min, max, ...textInputProps }) => {
  const cls = useStyles();

  return <TextInput {...textInputProps} type='datetime-local' min={min} max={max} />;
};

const useStyles = createUseStyles((theme) => ({}));
