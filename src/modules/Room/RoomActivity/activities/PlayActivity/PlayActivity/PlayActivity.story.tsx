/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { GameMocker } from 'src/mocks/records';
import { PlayActivity } from './PlayActivity';
import { RoomPlayActivityParticipant } from '../types';
import { RoomActivityParticipantMocker } from 'src/mocks/records/RoomActivityParticipant';
import { StorybookBaseProvider } from 'src/storybook/StorybookBaseProvider';
import { RoomProvider } from 'src/modules/Room/RoomProvider';
import { RoomMocker } from 'src/mocks/records/RoomMocker';

export default {
  component: PlayActivity,
  title: 'modules/Room/Activities/PlayActivity',
};

const gameMocker = new GameMocker();
const game = gameMocker.withPgn(
  '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 a6 5. Nc3 Qc7 6. Bd3 Nc6 7. Be3 b5 8. a3 Bb7 9. O-O'
);
const participantMocker = new RoomActivityParticipantMocker();

const myParticipant = participantMocker.withProps({ isPresent: true, isMe: true });
const myPlayParticipant: RoomPlayActivityParticipant = {
  roomActivitySpecificParticipantType: 'play',
  isRoomActivitySpecificParticipant: true,
  participant: myParticipant,
  userId: myParticipant.userId,
  isPlayer: true,
  canPlay: true,
  materialScore: 0,
  color: 'white',
} as const;

const opponentParticipant = participantMocker.record({ isPresent: true });
const opponentPlayParticipant = {
  roomActivitySpecificParticipantType: 'play',
  isRoomActivitySpecificParticipant: true,
  participant: opponentParticipant,
  userId: opponentParticipant.userId,
  isPlayer: true,
  canPlay: false,
  materialScore: 0,
  color: 'black',
} as const;

const roomMocker = new RoomMocker();

const room = roomMocker.record(
  myParticipant.isPresent && opponentParticipant.isPresent
    ? {
        [myParticipant.member.peer.id]: myParticipant.member.peer,
        [opponentParticipant.member.peer.id]: opponentParticipant.member.peer,
      }
    : undefined
);

export const defaultStory = () => (
  <StorybookBaseProvider
    withRedux
    initialState={{
      ...(myParticipant.isPresent && {
        peerProvider: {
          me: myParticipant.member.peer,
          room: room,
        },
      }),
    }}
  >
    <RoomProvider
      joinedRoom={{
        ...room,
        currentActivity: {
          type: 'none',
          participants: undefined,
        },
        members: {},
      }}
    >
      <PlayActivity
        activity={{
          type: 'play',
          game: game,
          iamParticipating: true,
          participants: {
            me: myPlayParticipant,
            opponent: opponentPlayParticipant,
          },
        }}
        deviceSize={{
          isDesktop: true,
          isMobile: false,
          isSmallMobile: false,
        }}
      />
    </RoomProvider>
  </StorybookBaseProvider>
);

export const withoutRoomProvider = () => (
  <StorybookBaseProvider
    withRedux
    initialState={{
      ...(myParticipant.isPresent && {
        peerProvider: {
          me: myParticipant.member.peer,
          room: room,
        },
      }),
    }}
  >
    <PlayActivity
      activity={{
        type: 'play',
        game: game,
        iamParticipating: true,
        participants: {
          me: myPlayParticipant,
          opponent: opponentPlayParticipant,
        },
      }}
      deviceSize={{
        isDesktop: true,
        isMobile: false,
        isSmallMobile: false,
      }}
    />
  </StorybookBaseProvider>
);
