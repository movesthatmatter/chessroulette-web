/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { action } from '@storybook/addon-actions';
import { ChallengeButtonWidget } from './ChallengeButtonWidget';
import { SocketConsumer, SocketProvider } from 'src/components/SocketProvider';

export default {
  component: ChallengeButtonWidget,
  title: 'components/ChallengeButtonWidget',
};

// This could fail if it's not authenticated
const userId = 'g-1'; 

export const defaultStory = () => (
  <SocketProvider>
    <SocketConsumer
      onReady={(socket) => {
        socket.send({
          kind: 'userIdentification',
          content: {
            userId,
          }
        })
      }}
      render={() => (
        <Grommet theme={defaultTheme}>
          <div style={{ width: '200px' }}>
            <ChallengeButtonWidget
              label="Play a Friend"
              userId="g-1"
              challengeType='challenge'
            />
            <ChallengeButtonWidget
              label="Quickpair"
              userId="g-1"
              challengeType='quickPairing'
            />
          </div>
        </Grommet>
      )}
    />
  </SocketProvider>
);
