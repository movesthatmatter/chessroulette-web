/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import { ActionButton } from './ActionButton';
import { Anchor, Upload } from 'grommet-icons';
import { action } from '@storybook/addon-actions';
import { delay } from 'src/lib/time';

export default {
  component: ActionButton,
  title: 'components/Button/ActionButton',
};

export const defaultStory = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
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
          disabled
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
            disabled
            reverse
            hideLabelUntilHover={false}
            onSubmit={action('on submit action b')}
          />
        </div>
      </div>
    </div>
    <div
      style={{
        width: '300px',
        // padding: '0 32px',
      }}
    >
      <h5>With Loader</h5>
      <div
        style={{
          marginBottom: '16px',
        }}
      >
        <ActionButton
          type="primary"
          actionType="positive"
          label="Action A"
          withLoader
          icon={Anchor}
          onSubmit={() => {
            action('on submit')();

            return delay(2000).then(action('on submit response'));
          }}
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
          withLoader
          icon={Anchor}
          onSubmit={() => {
            action('on submit')();

            return delay(2000).then(action('on submit response'));
          }}
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
          withLoader
          hideLabelUntilHover={false}
          icon={Anchor}
          onSubmit={() => {
            action('on submit')();

            return delay(2000).then(action('on submit response'));
          }}
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
            onSubmit={() => {
              action('on submit')();

              return delay(2000).then(action('on submit response'));
            }}
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
            onSubmit={() => {
              action('on submit')();

              return delay(2000).then(action('on submit response'));
            }}
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
            onSubmit={() => {
              action('on submit')();

              return delay(2000).then(action('on submit response'));
            }}
          />
        </div>
      </div>
    </div>
  </div>
);

export const diablingOnFirstClickStory = () =>
  React.createElement(() => {
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(action(`Disabled: ${isDisabled}`), [isDisabled]);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
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
              disabled={isDisabled}
              onFirstClick={() => {
                action('Going to disable')();
                setTimeout(() => {
                  setIsDisabled(true);
                }, 1000);
              }}
              onSubmit={() => {
                action('on submit action a')();
              }}
            />
          </div>
        </div>
      </div>
    );
  });

export const enablingAfterTwoSecondsStory = () =>
  React.createElement(() => {
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(action(`Disabled: ${isDisabled}`), [isDisabled]);

    useEffect(() => {
      setTimeout(() => {
        setIsDisabled(false);
      }, 2 * 1000);
    }, []);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
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
              disabled={isDisabled}
              onFirstClick={() => {
                action('On First Click')();
                // setTimeout(() => {
                //   setIsDisabled(true);
                // }, 1000);
              }}
              onSubmit={() => {
                action('On Submit')();
              }}
            />
          </div>
        </div>
      </div>
    );
  });
