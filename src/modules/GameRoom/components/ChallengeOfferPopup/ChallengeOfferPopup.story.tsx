/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { action } from '@storybook/addon-actions';
import { PeerMocker } from 'src/mocks/records/PeerMocker';
import { Peer } from 'src/components/RoomProvider';
import { ChallengeOfferPopup } from './ChallengeOfferPopup';
import { GameChallengeRecord } from '../../records/GameDataRecord';

export default {
  component: ChallengeOfferPopup,
  title: 'Modules/GameRoom/Components/Challenge Offer Popup',
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

const challengeOfferSending: GameChallengeRecord = {
  challengerId: me.id,
  challengeeId: peers[2].id,
};

const challengeOfferReceiving: GameChallengeRecord = {
  challengerId: peers[2].id,
  challengeeId: me.id,
};

const challengeOfferOthers: GameChallengeRecord = {
  challengerId: peers[1].id,
  challengeeId: peers[0].id,
};

const peersAsMap = peers.reduce((accum, peer) => ({
  ...accum,
  [peer.id]: peer,
}), {} as Record<string, Peer>);

export const YouChallenging = () => React.createElement(() => (
  <div style={{ display: 'flex', width: '400px' }}>
    <ChallengeOfferPopup
      challengeOffer={challengeOfferSending}
      meId={me.id}
      challenger={me}
      challengee={peersAsMap[challengeOfferSending.challengeeId]}
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
      challengee={me}
      challenger={peersAsMap[challengeOfferReceiving.challengerId]}
      meId={me.id}
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
      challengee={peersAsMap[challengeOfferOthers.challengeeId]}
      challenger={peersAsMap[challengeOfferOthers.challengerId]}
      meId={me.id}
      onAccepted={action('accepted')}
      onCancelled={action('cancelled')}
      onRefused={action('refused')}
    />
  </div>
));

export const all = () => (
  <div>
    <div style={{ marginBottom: '20px' }}>
      <ChallengeOfferPopup
        challengeOffer={challengeOfferSending}
        meId={me.id}
        challenger={me}
        challengee={peersAsMap[challengeOfferSending.challengeeId]}
        onAccepted={action('accepted')}
        onCancelled={action('cancelled')}
        onRefused={action('refused')}
      />
    </div>
    <div style={{ marginBottom: '20px' }}>
      <ChallengeOfferPopup
        challengeOffer={challengeOfferReceiving}
        meId={me.id}
        challengee={me}
        challenger={peersAsMap[challengeOfferReceiving.challengerId]}
        onAccepted={action('accepted')}
        onCancelled={action('cancelled')}
        onRefused={action('refused')}
      />
    </div>
    <div style={{ marginBottom: '20px' }}>
      <ChallengeOfferPopup
        challengeOffer={challengeOfferOthers}
        challengee={peersAsMap[challengeOfferOthers.challengeeId]}
        challenger={peersAsMap[challengeOfferOthers.challengerId]}
        meId={me.id}
        onAccepted={action('accepted')}
        onCancelled={action('cancelled')}
        onRefused={action('refused')}
      />
    </div>
  </div>
);
