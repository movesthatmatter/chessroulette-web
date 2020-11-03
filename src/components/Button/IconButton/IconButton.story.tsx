/* eslint-disable import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';
import React from 'react';
import { IconButton } from './IconButton';
import { Upload } from 'grommet-icons';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';

export default {
  component: IconButton,
  title: 'components/IconButton',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <div
      style={{
        width: '300px',
        // padding: '0 32px',
      }}
    >
      <div
        style={{
          marginBottom: '16px',
        }}
      >
        <IconButton
          type="primary"
          onSubmit={action('on submit')}
          icon={Upload}
        />
      </div>
      <div
        style={{
          marginBottom: '16px',
        }}
      >
        <IconButton
          type="attention"
          onSubmit={action('on submit')}
          icon={Upload}
        />
      </div>
      <div
        style={{
          marginBottom: '16px',
        }}
      >
        <IconButton
          type="positive"
          onSubmit={action('on submit')}
          icon={Upload}
        />
      </div>
      <div
        style={{
          marginBottom: '16px',
        }}
      >
        <IconButton
          type="negative"
          onSubmit={action('on submit')}
          icon={Upload}
        />
      </div>
      <div
        style={{
          marginBottom: '16px',
        }}
      >
        <IconButton
          disabled
          type="primary"
          onSubmit={action('on submit')}
          icon={Upload}
        />
      </div>
    </div>
  </Grommet>
)