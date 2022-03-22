/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { GameMocker } from 'src/mocks/records';
import { RoomActivityParticipantMocker } from 'src/mocks/records/RoomActivityParticipant';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { JoinedRoomProvider } from 'src/modules/Room/JoinedRoomProvider';
import { StorybookBaseProvider } from 'src/storybook/StorybookBaseProvider';
import { RoomPlayActivityParticipant } from '../types';
import { PlayActivityContainer } from './PlayActivityContainer';

export default {
  component: PlayActivityContainer,
  title: 'modules/Room/Activities/PlayActivityContainer',
};

const gameMocker = new GameMocker();
const game = gameMocker.started();
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
    <JoinedRoomProvider
      joinedRoom={{
        ...room,
        currentActivity: {
          type: 'none',
          participants: undefined,
        },
        members: {},
      }}
    >
      <PlayActivityContainer
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
        // size={500}
      />
    </JoinedRoomProvider>
  </StorybookBaseProvider>
);
