/* eslint-disable import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';
import React from 'react';
import { IconButton } from './IconButton';
import {
  Upload,
  Achievement,
  BackTen,
  Validate,
  SafariOption,
  Gremlin,
  TapeOption,
} from 'grommet-icons';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { delay } from 'src/lib/time';

export default {
  component: IconButton,
  title: 'components/Button/IconButton',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '100px',
          // padding: '0 32px',
        }}
      >
        <h6>Default</h6>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton type="primary" onSubmit={action('on submit')} icon={Achievement} />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton type="attention" onSubmit={action('on submit')} icon={BackTen} />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton type="positive" onSubmit={action('on submit')} icon={Validate} />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton type="negative" onSubmit={action('on submit')} icon={SafariOption} />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton disabled type="primary" onSubmit={action('on submit')} icon={Gremlin} />
        </div>
      </div>
      <div
        style={{
          width: '100px',
          // padding: '0 32px',
        }}
      >
        <h6>Clear</h6>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton type="primary" clear onSubmit={action('on submit')} icon={Achievement} />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton type="attention" clear onSubmit={action('on submit')} icon={BackTen} />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton type="positive" clear onSubmit={action('on submit')} icon={Validate} />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton type="negative" clear onSubmit={action('on submit')} icon={SafariOption} />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton disabled type="primary" clear onSubmit={action('on submit')} icon={Gremlin} />
        </div>
      </div>
      <div
        style={{
          width: '100px',
          // padding: '0 32px',
        }}
      >
        <h6>With Loader</h6>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="primary"
            withLoader
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            icon={Achievement}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="attention"
            withLoader
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            icon={BackTen}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="positive"
            withLoader
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            icon={Validate}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="negative"
            withLoader
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            icon={SafariOption}
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
            withLoader
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            icon={Gremlin}
          />
        </div>
      </div>
      <div
        style={{
          width: '120px',
          // padding: '0 32px',
        }}
      >
        <h6>Clear With Loader</h6>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="primary"
            withLoader
            clear
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            icon={Achievement}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="attention"
            withLoader
            clear
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            icon={BackTen}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="positive"
            withLoader
            clear
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            icon={Validate}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <IconButton
            type="negative"
            withLoader
            clear
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            icon={SafariOption}
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
            withLoader
            clear
            onSubmit={() => {
              action('on submit')();

              return delay(2000);
            }}
            icon={Gremlin}
          />
        </div>
      </div>
    </div>
  </Grommet>
);
