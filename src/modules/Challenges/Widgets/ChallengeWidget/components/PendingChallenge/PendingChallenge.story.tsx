/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { ChallengeMocker } from 'src/mocks/records';
import { PendingChallenge } from './PendingChallenge';

export default {
  component: PendingChallenge,
  title: 'components/PendingChallenge',
};

const challengeMocker = new ChallengeMocker();

export const asPrivateChallenge = () => (
    <PendingChallenge challenge={challengeMocker.record('public')} />
);

export const asQuickPairing = () => (
    <PendingChallenge challenge={challengeMocker.record('private')} />
);
