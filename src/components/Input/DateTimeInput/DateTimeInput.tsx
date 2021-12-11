import React from 'react';
import { TextInput, TextInputProps } from 'src/components/TextInput';
import { ISODateTime } from 'src/lib/date/ISODateTime';

export type DateTimeInputProps = Omit<TextInputProps, 'type'> & {
  min?: ISODateTime;
  max?: ISODateTime;
};

export const DateTimeInput: React.FC<DateTimeInputProps> = ({ min, max, ...textInputProps }) => {
  return <TextInput {...textInputProps} type="datetime-local" min={min} max={max} />;
};
