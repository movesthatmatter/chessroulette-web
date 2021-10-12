/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { ChallengeButtonWidget } from './ChallengeButtonWidget';
import { SocketConsumer, SocketProvider } from 'src/providers/SocketProvider';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { UserRecordMocker } from 'src/mocks/records';

export default {
  component: ChallengeButtonWidget,
  title: 'components/ChallengeButtonWidget',
};

const userMocker = new UserRecordMocker();

const user = userMocker.record(true);

export const defaultStory = () => (
  <SocketProvider>
    <SocketConsumer
      onReady={(socket) => {
        socket.send({
          kind: 'userIdentification',
          content: {
            isGuest: true,
            guestUserId: user.id,
          },
        })
      }}
      render={() => (
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
      )}
    />
  </SocketProvider>
);
