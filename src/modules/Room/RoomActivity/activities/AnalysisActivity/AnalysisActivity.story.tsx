/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { GameMocker, pgnToChessHistory } from 'src/mocks/records';
import { AnalysisActivity } from './AnalysisActivity';
import { RoomAnalysisActivityParticipant } from './types';
import { RoomActivityParticipantMocker } from 'src/mocks/records/RoomActivityParticipant';
import { StorybookBaseProvider } from 'src/storybook/StorybookBaseProvider';
import { RoomProvider } from 'src/modules/Room/RoomProvider';
import { RoomMocker } from 'src/mocks/records/RoomMocker';
import { second } from 'src/lib/time';
import { AnalysisRecordMocker } from 'src/mocks/records/AnalysisRecordMocker';
import { addMoveToChessHistory } from 'dstnd-io/dist/analysis/analysisActions';

export default {
  component: AnalysisActivity,
  title: 'modules/Room/Activities/AnlaysisActivity',
};

const participantMocker = new RoomActivityParticipantMocker();

const myParticipant = participantMocker.withProps({ isPresent: true, isMe: true });
const myAnalsyisParticipant: RoomAnalysisActivityParticipant = {
  roomActivitySpecificParticipantType: 'analysis',
  isRoomActivitySpecificParticipant: true,
  participant: myParticipant,
  userId: myParticipant.userId,
} as const;

const opponentParticipant = participantMocker.record({ isPresent: true });
const opponentAnalysisParticipant = {
  roomActivitySpecificParticipantType: 'analysis',
  isRoomActivitySpecificParticipant: true,
  participant: opponentParticipant,
  userId: opponentParticipant.userId,
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

const analysisMocker = new AnalysisRecordMocker();

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
          type: 'analysis',
          analysisId: '23',
          participants: {},
        },
        members: {},
      }}
    >
      <AnalysisActivity
        boardSize={500}
        analysis={analysisMocker.record()}
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
    <AnalysisActivity
      boardSize={500}
      analysis={analysisMocker.record(
        '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 a6 5. Nc3 Qc7 6. Bd3 Nc6 7. Be3 b5 8. a3 Bb7 9. O-O Rc8 10. Nxc6 Qxc6 11. Qg4 Nf6 12. Qg3 h5 13. e5 Nd5 14. Ne4 h4 15. Qh3 Qc7 16. f4 Nxe3 17. Qxe3 h3 18. gxh3 f5 19. exf6 d5 20. Nf2 Kf7 21. Rae1 Re8 22. Qg3 g5 23. fxg5 Qxg3+ 24. hxg3 e5 25. g6+ Kxf6 26. Ng4+ Kg5 27. Rf5+ 1-0'
      )}
      deviceSize={{
        isDesktop: true,
        isMobile: false,
        isSmallMobile: false,
      }}
    />
  </StorybookBaseProvider>
);

export const withShortPgn = () => (
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
    <AnalysisActivity
      boardSize={500}
      analysis={analysisMocker.record('1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 a6 5. Nc3 Qc7 6. Bd3')}
      deviceSize={{
        isDesktop: true,
        isMobile: false,
        isSmallMobile: false,
      }}
    />
  </StorybookBaseProvider>
);

const linearHistory = pgnToChessHistory(
  '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 a6 5. Nc3 Qc7 6. Bd3',
  {
    white: second(),
    black: second(),
  }
);

const nestedMoves = [
  {
    from: 'd2',
    to: 'd4',
    san: 'd4',
    color: 'white',
    clock: second(),
  },
  {
    from: 'd7',
    to: 'd6',
    san: 'd6',
    color: 'black',
    clock: second(),
  },
  {
    from: 'a2',
    to: 'a3',
    san: 'a3',
    color: 'white',
    clock: second(),
  },
] as const;

const historyWithBranches = nestedMoves.reduce(
  (prev, move) => addMoveToChessHistory(prev, move, [1, 0])[0],
  linearHistory
);

const nestedMoves2Gen = [
  {
    from: 'c2',
    to: 'c4',
    san: 'c4',
    color: 'white',
    clock: second(),
  },
  {
    from: 'b7',
    to: 'b6',
    san: 'b6',
    color: 'black',
    clock: second(),
  },
  {
    from: 'a2',
    to: 'a4',
    san: 'a4',
    color: 'white',
    clock: second(),
  },
] as const;

const historyWithBranches2Gen = nestedMoves2Gen.reduce(
  (prev, nexMove) => addMoveToChessHistory(prev, nexMove, [1, 0, [1, 0]])[0],
  historyWithBranches
);

const nestedMovesWithBlackFirst = [
  {
    from: 'd7',
    to: 'd6',
    san: 'd6',
    color: 'black',
    clock: second(),
  },
  {
    from: 'a2',
    to: 'a3',
    san: 'a3',
    color: 'white',
    clock: second(),
  },
] as const;

// const branchIndex: BranchedHistoryIndex = [2, 0];
const historyWithBranches2GenAsBlack = nestedMovesWithBlackFirst.reduce(
  (prev, move) => addMoveToChessHistory(prev, move, [4, 0])[0],
  historyWithBranches2Gen
);

export const withNestedBranches = () => (
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
    <AnalysisActivity
      boardSize={500}
      analysis={{
        ...analysisMocker.record(),
        history: historyWithBranches2GenAsBlack,
        focusIndex: historyWithBranches2GenAsBlack.length - 1,
      }}
      deviceSize={{
        isDesktop: true,
        isMobile: false,
        isSmallMobile: false,
      }}
    />
  </StorybookBaseProvider>
);

const anotherNestedMoves1Gen = [
  {
    from: 'd7',
    to: 'd5',
    san: 'd5',
    color: 'black',
    clock: second(),
  },
] as const;

const historyWithParallelBranches = anotherNestedMoves1Gen.reduce(
  (prev, nexMove) => addMoveToChessHistory(prev, nexMove, [2, 1])[0],
  historyWithBranches
);

export const withParallelBranches = () => (
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
    <AnalysisActivity
      boardSize={500}
      analysis={{
        ...analysisMocker.record(),
        history: historyWithParallelBranches,
        focusIndex: historyWithParallelBranches.length - 1,
      }}
      deviceSize={{
        isDesktop: true,
        isMobile: false,
        isSmallMobile: false,
      }}
    />
  </StorybookBaseProvider>
);
