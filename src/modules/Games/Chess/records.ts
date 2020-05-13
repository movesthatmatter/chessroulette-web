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

export const chessGameStateFen = io.string;
export const chessGameStatePgn = io.string;

export const chessGameState = io.union([
  io.undefined,
  io.type({
    players: io.type({
      white: chessPlayerWhite,
      black: chessPlayerBlack,
    }),
    timeLeft: io.union(
      [
        io.type({
          white: io.number,
          black: io.number,
        }),
        io.undefined,
      ],
    ),
    pgn: chessGameStatePgn,
    lastMoved: io.keyof(chessPlayers.props),
  }),
]);


export type ChessPlayer = io.TypeOf<typeof chessPlayer>;
export type ChessPlayers = io.TypeOf<typeof chessPlayers>;
export type ChessPlayerWhite = io.TypeOf<typeof chessPlayerWhite>;
export type ChessPlayerBlack = io.TypeOf<typeof chessPlayerBlack>;
export type ChessGameState = io.TypeOf<typeof chessGameState>;
export type ChessGameStateFen = io.TypeOf<typeof chessGameStateFen>;
export type ChessGameStatePgn = io.TypeOf<typeof chessGameStatePgn>;
