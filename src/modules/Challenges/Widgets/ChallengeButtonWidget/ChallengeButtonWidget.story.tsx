/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Grommet } from 'grommet';
import { defaultTheme } from 'src/theme';
import { ChallengeButtonWidget } from './ChallengeButtonWidget';
import { SocketConsumer, SocketProvider } from 'src/components/SocketProvider';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { UserRecordMocker } from 'src/mocks/records';

export default {
  component: ChallengeButtonWidget,
  title: 'components/ChallengeButtonWidget',
};

const userMocker = new UserRecordMocker();

const user = userMocker.record();

export const defaultStory = () => (
  <SocketProvider>
    <SocketConsumer
      onReady={(socket) => {
        socket.send({
          kind: 'userIdentification',
          content: {
            userId: user.id,
          },
        })
      }}
      render={() => (
        <Grommet theme={defaultTheme}>
          <div style={{ width: '200px' }}>
            <StorybookReduxProvider initialState={{
              authentication: {
                authenticationType: 'guest',
                user: user,
              }
            }}>
              <ChallengeButtonWidget
                label="Play a Friend"
                challengeType='private'
              />
              <ChallengeButtonWidget
                label="Quickpair"
                challengeType='public'
              />
            </StorybookReduxProvider>
          </div>
        </Grommet>
      )}
    />
  </SocketProvider>
);
