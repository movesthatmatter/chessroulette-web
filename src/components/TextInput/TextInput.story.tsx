import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { defaultTheme } from 'src/theme';
import { TextInput } from './TextInput';


export default {
  component: TextInput,
  title: 'components/TextInput',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <div style={{
      width: '300px',
    }}
    >
      <TextInput />
    </div>
  </Grommet>
);

export const withLabel = () => (
  <Grommet theme={defaultTheme}>
    <div style={{
      width: '300px',
    }}
    >
      <TextInput 
        label="My Label"
      />
    </div>
  </Grommet>
);
