import * as io from 'io-ts';

export const chessPlayerWhite = io.type({
  color: io.literal('white'),
  id: io.string,
  name: io.string,
});

export const chessPlayerBlack = io.type({
  color: io.literal('black'),
  id: io.string,
  name: io.string,
});

export const chessPlayer = io.union([
  chessPlayerBlack,
  chessPlayerWhite,
]);

export const chessPlayers = io.type({
  white: chessPlayerWhite,
  black: chessPlayerBlack,
});

export const chessGameState = io.type({
  players: io.type({
    white: chessPlayerWhite,
    black: chessPlayerBlack,
  }),
  pgn: io.union([io.string, io.undefined]),
});

export const chessGameStateFen = io.string;
export const chessGameStatePgn = io.string;

export type ChessPlayer = io.TypeOf<typeof chessPlayer>;
export type ChessPlayers = io.TypeOf<typeof chessPlayers>;
export type ChessPlayerWhite = io.TypeOf<typeof chessPlayerWhite>;
export type ChessPlayerBlack = io.TypeOf<typeof chessPlayerBlack>;
export type ChessGameState = io.TypeOf<typeof chessGameState>;
export type ChessGameStateFen = io.TypeOf<typeof chessGameStateFen>;
