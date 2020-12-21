/* eslint-disable import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';
import { Grommet } from 'grommet';
import React from 'react';
import { SocketProvider } from 'src/providers/SocketProvider';
import { ChallengeMocker, UserRecordMocker } from 'src/mocks/records';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { defaultTheme } from 'src/theme';
import { ChallengeWidget } from './ChallengeWidget';

export default {
  component: ChallengeWidget,
  title: 'modules/ChallengeWidget',
};

const challengeMocker = new ChallengeMocker();
const userMocker = new UserRecordMocker();

export const createPublicChallenge = () => (
  <Grommet theme={defaultTheme}>
    <StorybookReduxProvider
      initialState={{
        authentication: {
          authenticationType: 'guest',
          user: userMocker.record(),
        },
      }}
    >
      <ChallengeWidget
        // challenge={challengeMocker.record('public')}
        challengeType="public"
        onCreated={action('on created')}
        onAccepted={action('on accepted')}
        onCanceled={action('on canceled')}
        onMatched={action('on matched')}
      />
    </StorybookReduxProvider>
  </Grommet>
);

export const createPrivateChallenge = () => (
  <Grommet theme={defaultTheme}>
    <StorybookReduxProvider
      initialState={{
        authentication: {
          authenticationType: 'guest',
          user: userMocker.record(),
        },
      }}
    >
      <ChallengeWidget
        // challenge={challengeMocker.record('public')}
        challengeType="private"
        onCreated={action('on created')}
        onAccepted={action('on accepted')}
        onCanceled={action('on canceled')}
        onMatched={action('on matched')}
      />
    </StorybookReduxProvider>
  </Grommet>
);

export const acceptChallenge = () => (
  <Grommet theme={defaultTheme}>
    <StorybookReduxProvider
      initialState={{
        authentication: {
          authenticationType: 'guest',
          user: userMocker.record(),
        },
      }}
    >
      <ChallengeWidget
        challenge={challengeMocker.record('public')}
        onAccepted={action('on accepted')}
        onDenied={action('on canceled')}
        onMatched={action('on matched')}
        onCanceled={action('on canceled')}
      />
    </StorybookReduxProvider>
  </Grommet>
);

export const pendingPublicChallenge = () => {
  const user = userMocker.record();
  const challenge = challengeMocker.withProps({
    createdBy: user.id,
    type: 'public',
  });

  return (
    <Grommet theme={defaultTheme}>
      <StorybookReduxProvider
        initialState={{
          authentication: {
            authenticationType: 'guest',
            user,
          },
        }}
      >
        <SocketProvider>
          <ChallengeWidget
            challenge={challenge}
            onAccepted={action('on accepted')}
            onDenied={action('on denied')}
            onMatched={action('on matched')}
            onCanceled={action('on canceled')}
          />
        </SocketProvider>
      </StorybookReduxProvider>
    </Grommet>
  );
};

export const pendingPrivateChallenge = () => {
  const user = userMocker.record();
  const challenge = challengeMocker.withProps({
    createdBy: user.id,
    type: 'private',
  });

  return (
    <Grommet theme={defaultTheme}>
      <StorybookReduxProvider
        initialState={{
          authentication: {
            authenticationType: 'guest',
            user,
          },
        }}
      >
        <SocketProvider>
          <ChallengeWidget
            challenge={challenge}
            onAccepted={action('on accepted')}
            onDenied={action('on denied')}
            onMatched={action('on matched')}
            onCanceled={action('on canceled')}
          />
        </SocketProvider>
      </StorybookReduxProvider>
    </Grommet>
  );
};
