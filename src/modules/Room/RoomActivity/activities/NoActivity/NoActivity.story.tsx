/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { RoomActivityParticipantMocker } from 'src/mocks/records/RoomActivityParticipant';
import { StorybookBaseProvider } from 'src/storybook/StorybookBaseProvider';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { toISODateTime } from 'io-ts-isodatetime';
import { Date } from 'window-or-global';
import { NoActivity } from './NoActivity';
import { JoinedRoomProvider } from 'src/modules/Room/Providers/JoinedRoomProvider';
import { SocketClient } from 'src/services/socket/SocketClient';

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
    <JoinedRoomProvider
      readyPeerConnection={{
        ready: true,
        peer: myParticipant.member.peer,
        loading: false,
        // TODO: Aded this on Mar 22, 2022 to not break the compiler, but it
        //  fails at runtime as it needs to be mocked in order for the story to work
        connection: {} as SocketClient,
      }}
      room={{
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
    </JoinedRoomProvider>
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
    <JoinedRoomProvider
      readyPeerConnection={{
        ready: true,
        peer: myParticipant.member.peer,
        loading: false,
        // TODO: Aded this on Mar 22, 2022 to not break the compiler, but it
        //  fails at runtime as it needs to be mocked in order for the story to work
        connection: {} as SocketClient,
      }}
      room={{
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
            slug: room.slug,
            roomId: room.id,
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
    </JoinedRoomProvider>
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
