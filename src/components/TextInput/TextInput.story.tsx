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

export const withValue = () => (
  <Grommet theme={defaultTheme}>
    <div style={{
      width: '300px',
    }}
    >
      <TextInput
        label="With Value"
        value="A bad value"
      />
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

export const withPlaceholder = () => (
  <Grommet theme={defaultTheme}>
    <div style={{
      width: '300px',
    }}
    >
      <TextInput
        placeholder="My Placeholder"
      />
    </div>
  </Grommet>
);

export const asReadonly = () => (
  <Grommet theme={defaultTheme}>
    <div style={{
      width: '300px',
    }}
    >
      <TextInput
        label="My Label"
        value="My Readonly Value"
        readOnly
      />
    </div>
  </Grommet>
);


export const withValidationError = () => (
  <Grommet theme={defaultTheme}>
    <div style={{
      width: '300px',
    }}
    >
      <TextInput
        label="With Error"
        value="A bad value"
        validationError="The value you enetered isn't valid"
      />
    </div>
  </Grommet>
);