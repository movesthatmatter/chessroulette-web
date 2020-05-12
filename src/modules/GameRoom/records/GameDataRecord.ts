import * as io from 'io-ts';
import { chessGameState } from '../../Games/Chess';

const availableGames = io.type({
  chess: io.null,
});

export const gameUpdateRecord = io.type({
  msgType: io.literal('gameUpdate'),
  gameType: io.keyof(availableGames.props),
  // Generalize later on :D
  content: chessGameState,
});
export type GameUpdateRecord = io.TypeOf<typeof gameUpdateRecord>;

export const gameInvitationRecord = io.type({
  msgType: io.literal('gameInvitation'),
  gameType: io.keyof(availableGames.props),
  content: io.type({
    challengerId: io.string,
    challengeeId: io.string,
  }),
});
export type GameInvitationRecord = io.TypeOf<typeof gameInvitationRecord>;

export const gameInvitationRefusalRecord = io.type({
  msgType: io.literal('gameInvitationRefusal'),
  gameType: io.keyof(availableGames.props),
  content: io.type({
    from: io.string,
    to: io.string,
  }),
});
export type GameInvitationRefusalRecord = io.TypeOf<typeof gameInvitationRefusalRecord>;

export const gameStartedRecord = io.type({
  msgType: io.literal('gameStarted'),
  gameType: io.keyof(availableGames.props),
  content: chessGameState,
});
export type GameStartedRecord = io.TypeOf<typeof gameStartedRecord>;

export const gameFinishedRecord = io.type({
  msgType: io.literal('gameFinished'),
  gameType: io.keyof(availableGames.props),
  content: chessGameState,
});
export type GameFinishedRecord = io.TypeOf<typeof gameFinishedRecord>;

export const gameDataRecord = io.union([
  gameUpdateRecord,
  gameInvitationRecord,
  gameInvitationRefusalRecord,
  gameStartedRecord,
  gameFinishedRecord,
]);
export type GameDataRecord = io.TypeOf<typeof gameDataRecord>;
