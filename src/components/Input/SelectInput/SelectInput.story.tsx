import { action } from '@storybook/addon-actions';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { SelectInput } from './SelectInput';


export default {
  component: SelectInput,
  title: 'components/Inputs/SelectInput',
};

const options = [
  { label: 'option 1', value: '1' },
  { label: 'option 2', value: '2' },
  { label: 'option 3', value: '3' },
];

export const defaultStory = () => (
  <div style={{ maxWidth: '300px' }}>
      <SelectInput
        placeholder="Just my placeholder"
        // value="option 1"
        options={options}
        onChange={action('on change')}
        onSelect={action('on select')}
      />
  </div>
)