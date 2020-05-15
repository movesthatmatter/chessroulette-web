import * as io from 'io-ts';
import { chessGameState, chessGameStateNeverStarted } from '../../Games/Chess';

const availableGames = io.type({
  chess: io.null,
});

export const gameChallengeRecord = io.type({
  challengerId: io.string,
  challengeeId: io.string,

  // TODO: add them here
  // timeLimit: 'rapid', // Get it from outside
  // homeColor: 'random', // Get it from outside
});
export type GameChallengeRecord = io.TypeOf<typeof gameChallengeRecord>;

export const gameUpdateRecord = io.type({
  msgType: io.literal('gameUpdate'),
  gameType: io.keyof(availableGames.props),
  // Generalize later on :D
  content: chessGameState,
});
export type GameUpdateRecord = io.TypeOf<typeof gameUpdateRecord>;

export const gameChallengeOfferRecord = io.type({
  msgType: io.literal('gameChallengeOffer'),
  gameType: io.keyof(availableGames.props),
  content: gameChallengeRecord,
});
export type GameChallengeOfferRecord = io.TypeOf<typeof gameChallengeOfferRecord>;

// export const gameChallengeAcceptedRecord = io.type({
//   msgType: io.literal('gameChallengeAccepted'),
//   gameType: io.keyof(availableGames.props),
//   content: gameChallengeRecord,
// });
// export type GameChallengeAcceptedRecord = io.TypeOf<typeof gameChallengeAcceptedRecord>;

export const gameChallengeRefusedRecord = io.type({
  msgType: io.literal('gameChallengeRefused'),
  gameType: io.keyof(availableGames.props),
  content: gameChallengeRecord,
});
export type GameChallengeRefusedRecord = io.TypeOf<typeof gameChallengeRefusedRecord>;

export const gameChallengeCancelledRecord = io.type({
  msgType: io.literal('gameChallengeCancelled'),
  gameType: io.keyof(availableGames.props),
  content: gameChallengeRecord,
});
export type GameChallengeCancelledRecord = io.TypeOf<typeof gameChallengeCancelledRecord>;

export const gameStartedRecord = io.type({
  msgType: io.literal('gameStarted'),
  gameType: io.keyof(availableGames.props),
  content: chessGameState,
});
export type GameStartedRecord = io.TypeOf<typeof gameStartedRecord>;

export const gameFinishedRecord = io.type({
  msgType: io.literal('gameFinished'),
  gameType: io.keyof(availableGames.props),
  content: io.union([chessGameStateNeverStarted, chessGameStateNeverStarted]),
});
export type GameFinishedRecord = io.TypeOf<typeof gameFinishedRecord>;

export const gameDataRecord = io.union([
  gameUpdateRecord,
  gameChallengeOfferRecord,
  gameChallengeCancelledRecord,
  gameChallengeRefusedRecord,
  gameStartedRecord,
  gameFinishedRecord,
]);
export type GameDataRecord = io.TypeOf<typeof gameDataRecord>;
