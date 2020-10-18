import { action } from '@storybook/addon-actions';
import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { ChallengeMocker } from 'src/mocks/records';
import { defaultTheme } from 'src/theme';
import { PendingChallenge } from './PendingChallenge';

export default {
  component: PendingChallenge,
  title: 'components/PendingChallenge',
};

const challengeMocker = new ChallengeMocker();

export const asPrivateChallenge = () => (
  <Grommet theme={defaultTheme}>
    <PendingChallenge
      challenge={challengeMocker.record()}
      onCancel={action('on cancel')}
      type={'challenge'}
    />
  </Grommet>
);

export const asQuickPairing = () => (
  <Grommet theme={defaultTheme}>
    <PendingChallenge
      challenge={challengeMocker.record()}
      onCancel={action('on cancel')}
      type={'quickPairing'}
    />
  </Grommet>
);
