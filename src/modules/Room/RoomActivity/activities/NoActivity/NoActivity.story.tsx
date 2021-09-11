/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { GameMocker } from 'src/mocks/records';
import { RoomActivityParticipantMocker } from 'src/mocks/records/RoomActivityParticipant';
import { StorybookBaseProvider } from 'src/storybook/StorybookBaseProvider';
import { RoomProvider } from 'src/modules/Room/RoomProvider';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { toISODateTime } from 'io-ts-isodatetime';
import { Date } from 'window-or-global';
import { NoActivity } from './NoActivity';

export default {
  component: NoActivity,
  title: 'modules/Room/Activities/NoActivity',
};

const participantMocker = new RoomActivityParticipantMocker();

const myParticipant = participantMocker.withProps({ isPresent: true, isMe: true });
const myPlayParticipant = {
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
// const opponentPlayParticipant = {
//   roomActivitySpecificParticipantType: 'play',
//   isRoomActivitySpecificParticipant: true,
//   participant: opponentParticipant,
//   userId: opponentParticipant.userId,
//   isPlayer: true,
//   canPlay: false,
//   materialScore: 0,
//   color: 'black',
// } as const;

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
      <NoActivity
        deviceSize={{
          isDesktop: true,
          isMobile: false,
          isSmallMobile: false,
        }}
      />
    </RoomProvider>
  </StorybookBaseProvider>
);

export const withPendingChallenge = () => (
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
        pendingChallenges: {
          '0': {
            id: '0',
            gameSpecs: {
              timeLimit: 'blitz3',
              preferredColor: 'black',
            },
            createdAt: toISODateTime(new Date()),
            slug: 'asda',
            type: 'private',
            createdBy: myPlayParticipant.participant.member.peer.user.id,
            createdByUser: myPlayParticipant.participant.member.peer.user,
          },
        },
      }}
    >
      <NoActivity
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
    <NoActivity
      deviceSize={{
        isDesktop: true,
        isMobile: false,
        isSmallMobile: false,
      }}
    />
  </StorybookBaseProvider>
);