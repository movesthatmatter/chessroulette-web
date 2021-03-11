/* eslint-disable import/no-extraneous-dependencies */
import { Grommet } from 'grommet';
import React from 'react';
import { defaultTheme } from 'src/theme';
import { CodeInput } from './CodeInput';


export default {
  component: CodeInput,
  title: 'components/CodeInput',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <CodeInput fieldsCount={5} />
  </Grommet>
);
