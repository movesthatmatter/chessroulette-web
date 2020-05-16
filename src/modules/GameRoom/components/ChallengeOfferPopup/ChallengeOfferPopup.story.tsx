import React from 'react';
import { action } from '@storybook/addon-actions';
import { ChallengeOfferPopup } from './ChallengeOfferPopup';
import { GameChallengeRecord } from '../../records/GameDataRecord';

export default {
  component: ChallengeOfferPopup,
  title: 'Components/Popups/Challenge Offer',
};

const challengeOfferSending: GameChallengeRecord = {
  challengerId: '1',
  challengeeId: '2',
};

const challengeOfferReceiving: GameChallengeRecord = {
  challengerId: '2',
  challengeeId: '1',
};

const challengeOfferOthers: GameChallengeRecord = {
  challengerId: '3',
  challengeeId: '4',
};

const me = {
  id: '1',
  name: 'Capra',
};

const peers = {
  1: {
    id: '1',
    name: 'Capra',
  },
  2: {
    id: '2',
    name: 'Elefantu verde',
  },
  3: {
    id: '3',
    name: 'Hipopotamu',
  },
  4: {
    id: '4',
    name: 'Girafa Mov',
  },
};

export const YouChallenging = () => React.createElement(() => (
  <div style={{ display: 'flex', width: '400px' }}>
    <ChallengeOfferPopup
      challengeOffer={challengeOfferSending}
      me={me}
      peers={peers}
      onAccepted={action('accepted')}
      onCancelled={action('cancelled')}
      onRefused={action('refused')}
    />
  </div>
));

export const ReceivingChallenge = () => React.createElement(() => (
  <div style={{ display: 'flex', width: '400px' }}>
    <ChallengeOfferPopup
      challengeOffer={challengeOfferReceiving}
      me={me}
      peers={peers}
      onAccepted={action('accepted')}
      onCancelled={action('cancelled')}
      onRefused={action('refused')}
    />
  </div>
));

export const OthersChallenge = () => React.createElement(() => (
  <div style={{ display: 'flex', width: '400px' }}>
    <ChallengeOfferPopup
      challengeOffer={challengeOfferOthers}
      me={me}
      peers={peers}
      onAccepted={action('accepted')}
      onCancelled={action('cancelled')}
      onRefused={action('refused')}
    />
  </div>
));
