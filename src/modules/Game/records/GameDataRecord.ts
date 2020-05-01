import * as io from 'io-ts';
import { chessGameState, chessGameStateFen } from '../../Games/Chess';

const availableGames = io.type({
  chess: io.null,
});

export const gameUpdateRecord = io.type({
  msgType: io.literal('gameUpdate'),
  gameType: io.keyof(availableGames.props),
  // Just the Fen
  content: io.type({
    fen: chessGameStateFen,
  }),
});

export const gameInvitationRecord = io.type({
  msgType: io.literal('gameInvitation'),
  gameType: io.keyof(availableGames.props),
  content: io.type({
    from: io.string,
    to: io.string,
  }),
});

export const gameInvitationRefusalRecord = io.type({
  msgType: io.literal('gameInvitationRefusal'),
  gameType: io.keyof(availableGames.props),
  content: io.type({
    from: io.string,
    to: io.string,
  }),
});

export const gameStartedRecord = io.type({
  msgType: io.literal('gameStarted'),
  gameType: io.keyof(availableGames.props),
  content: chessGameState,
});

export const gameFinishedRecord = io.type({
  msgType: io.literal('gameFinished'),
  gameType: io.keyof(availableGames.props),
  content: chessGameState,
});

export const gameDataRecord = io.union([
  gameUpdateRecord,
  gameInvitationRecord,
  gameInvitationRefusalRecord,
  gameStartedRecord,
  gameFinishedRecord,
]);


export type GameUpdateRecord = io.TypeOf<typeof gameUpdateRecord>;

export type GameInvitationRecord = io.TypeOf<typeof gameInvitationRecord>;
export type GameInvitationRefusalRecord = io.TypeOf<typeof gameInvitationRefusalRecord>;
export type GameStartedRecord = io.TypeOf<typeof gameStartedRecord>;
export type GameFinishedRecord = io.TypeOf<typeof gameFinishedRecord>;


export type GameDataRecord = io.TypeOf<typeof gameDataRecord>;
