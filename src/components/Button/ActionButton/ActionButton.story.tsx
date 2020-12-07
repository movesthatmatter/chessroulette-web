import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { defaultTheme } from 'src/theme';
import { ActionButton } from './ActionButton';
import { Anchor, Upload } from 'grommet-icons';
import { action, actions } from '@storybook/addon-actions';

export default {
  component: ActionButton,
  title: 'components/Button/ActionButton',
};

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <div
        style={{
          width: '300px',
          // padding: '0 32px',
        }}
      >
        <h5>Aligned Left</h5>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <ActionButton
            type="primary"
            actionType="positive"
            label="Action A"
            icon={Anchor}
            onSubmit={action('on submit action a')}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <ActionButton
            type="attention"
            actionType="negative"
            label="Action A"
            icon={Anchor}
            onSubmit={action('on submit action a')}
          />
        </div>
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <ActionButton
            type="attention"
            actionType="negative"
            label="No Hover Action A"
            hideLabelUntilHover={false}
            icon={Anchor}
            onSubmit={action('on submit action a')}
          />
        </div>
      </div>
      <div
        style={{
          width: '300px',
          textAlign: 'right',
        }}
      >
        <h5>Aligned Right</h5>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              marginBottom: '16px',
              flex: 1,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <ActionButton
              type="primary"
              actionType="negative"
              label="Action B"
              icon={Upload}
              reverse
              onSubmit={action('on submit action b')}
            />
          </div>
          <div
            style={{
              marginBottom: '16px',
              flex: 1,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <ActionButton
              type="attention"
              actionType="positive"
              label="Action B"
              icon={Upload}
              reverse
              onSubmit={action('on submit action b')}
              confirmation="Really ?"
            />
          </div>
          <div
            style={{
              marginBottom: '16px',
              flex: 1,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <ActionButton
              type="primary"
              actionType="negative"
              label="No Hover Action B"
              icon={Upload}
              reverse
              hideLabelUntilHover={false}
              onSubmit={action('on submit action b')}
            />
          </div>
        </div>
      </div>
    </div>
  </Grommet>
);
