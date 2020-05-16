/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
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

// const me = {
//   id: '1',
//   name: 'Capra',
// };

const peerMocker = new PeerMocker();
const me = peerMocker.withProps({
  name: 'Capra',
});

const peers = [
  peerMocker.withProps({ name: 'Elefantu verde' }),
  peerMocker.withProps({ name: 'Hipopotamu' }),
  peerMocker.withProps({ name: 'Girafa Mov' }),
];

const peersAsMap = peers.reduce((accum, peer) => ({
  ...accum,
  [peer.id]: peer,
}), {});

export const YouChallenging = () => React.createElement(() => (
  <div style={{ display: 'flex', width: '400px' }}>
    <ChallengeOfferPopup
      challengeOffer={challengeOfferSending}
      me={me}
      peers={peersAsMap}
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
      peers={peersAsMap}
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
      peers={peersAsMap}
      onAccepted={action('accepted')}
      onCancelled={action('cancelled')}
      onRefused={action('refused')}
    />
  </div>
));
