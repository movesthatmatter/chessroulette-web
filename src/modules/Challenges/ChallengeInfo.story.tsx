import { action } from '@storybook/addon-actions';
import { Box, Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Page } from 'src/components/Page';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { UserInfoMocker } from 'src/mocks/records';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { defaultTheme } from 'src/theme';
import { ChallengeInfo } from './ChallengeInfo';

export default {
  component: ChallengeInfo,
  title: 'modules/Challenges/ChallengeInfo',
};

const userMock = new UserInfoMocker();

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <ChallengeInfo
      challenge={{
        id: '1',
        gameSpecs: {
          timeLimit: 'bullet',
          preferredColor: 'white',
        },
        createdAt: toISODateTime(new Date()),
        createdBy: 'u3',
        slug: 'testChallenge',
        type: 'private',
      }}
      user={{
        id: 'u1',
        name: 'Gari Kasparov',
        avatarId: '2',
      }}
      onDeny={action('on deny')}
      onAccept={action('on accept')}
    />
  </Grommet>
);

export const asPage = () => (
  <Grommet theme={defaultTheme}>
    <div
      style={{
        height: '100vh',
        background: 'red',
      }}
    >
      <StorybookReduxProvider>
        <Page>
          <Box align="center" justify="center" alignContent="center">
            <ChallengeInfo
              challenge={{
                id: '1',
                gameSpecs: {
                  timeLimit: 'bullet',
                  preferredColor: 'white',
                },
                createdAt: toISODateTime(new Date()),
                createdBy: 'u3',
                slug: 'testChallenge',
                type: 'private',
              }}
              user={{
                id: 'u1',
                name: 'Gari Kasparov',
                avatarId: '2',
              }}
              onDeny={action('on deny')}
              onAccept={action('on accept')}
            />
          </Box>
        </Page>
      </StorybookReduxProvider>
    </div>
  </Grommet>
);
