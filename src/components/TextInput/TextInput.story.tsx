import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { console } from 'window-or-global';
import { TextInput } from './TextInput';

export default {
  component: TextInput,
  title: 'components/TextInput',
};

export const defaultStory = () => (
  <div
    style={{
      width: '300px',
    }}
  >
    <TextInput />
  </div>
);

export const withValue = () => (
  <div
    style={{
      width: '300px',
    }}
  >
    <TextInput label="With Value" defaultValue="A bad value" onChange={(event) => {
      action(event.currentTarget.value);
    }}/>
  </div>
);

export const withLabel = () => (
  <div
    style={{
      width: '300px',
    }}
  >
    <TextInput label="My Label"  onChange={(event) => {
      console.log(event.currentTarget.value)
    }}/>
  </div>
);

export const withPlaceholder = () => (
  <div
    style={{
      width: '300px',
    }}
  >
    <TextInput placeholder="My Placeholder"  onChange={(event) => {
      action(event.currentTarget.value);
    }}/>
  </div>
);

export const asReadonly = () => (
  <div
    style={{
      width: '300px',
    }}
  >
    <TextInput label="My Label" defaultValue="My Readonly Value" onChange={(event) => {
      action(event.currentTarget.value);
    }}/>
  </div>
);

export const withValidationError = () => (
  <div
    style={{
      width: '300px',
    }}
  >
    <TextInput
      label="With Error"
      defaultValue="A bad value"
      validationError="The value you enetered isn't valid"
    />
  </div>
);
