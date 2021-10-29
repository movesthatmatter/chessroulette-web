/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { CodeInput } from './CodeInput';


export default {
  component: CodeInput,
  title: 'components/CodeInput',
};

export const defaultStory = () => (
    <CodeInput fieldsCount={5} />
);
