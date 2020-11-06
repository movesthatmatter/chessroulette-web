import * as io from 'io-ts';

// respects chessjs PieceType
export const pieceTypeRecord = io.keyof({
  p: null,
  n: null,
  b: null,
  r: null,
  q: null,
  k: null,
});
export type PieceTypeRecord = io.TypeOf<typeof pieceTypeRecord>;

export const squareRecord = io.keyof({
  a8: io.null,
  b8: io.null,
  c8: io.null,
  d8: io.null,
  e8: io.null,
  f8: io.null,
  g8: io.null,
  h8: io.null,
  a7: io.null,
  b7: io.null,
  c7: io.null,
  d7: io.null,
  e7: io.null,
  f7: io.null,
  g7: io.null,
  h7: io.null,
  a6: io.null,
  b6: io.null,
  c6: io.null,
  d6: io.null,
  e6: io.null,
  f6: io.null,
  g6: io.null,
  h6: io.null,
  a5: io.null,
  b5: io.null,
  c5: io.null,
  d5: io.null,
  e5: io.null,
  f5: io.null,
  g5: io.null,
  h5: io.null,
  a4: io.null,
  b4: io.null,
  c4: io.null,
  d4: io.null,
  e4: io.null,
  f4: io.null,
  g4: io.null,
  h4: io.null,
  a3: io.null,
  b3: io.null,
  c3: io.null,
  d3: io.null,
  e3: io.null,
  f3: io.null,
  g3: io.null,
  h3: io.null,
  a2: io.null,
  b2: io.null,
  c2: io.null,
  d2: io.null,
  e2: io.null,
  f2: io.null,
  g2: io.null,
  h2: io.null,
  a1: io.null,
  b1: io.null,
  c1: io.null,
  d1: io.null,
  e1: io.null,
  f1: io.null,
  g1: io.null,
  h1: io.null,
});
export type SquareRecord = io.TypeOf<typeof squareRecord>;

// respects chessjs Move
export const chessMove = io.type({
  from: squareRecord,
  to: squareRecord,

  color: io.keyof({
    b: null,
    w: null,
  }),

  /** Flags indicating what occurred, combined into one string */
  flags: io.string,

  /**
     * The type of the piece that moved
     */
  piece: pieceTypeRecord,

  /** The Standard Algebraic Notation (SAN) representation of the move */
  san: io.string,

  /**
   * If an enemy piece was captured this is their type
   */
  captured: io.union([io.keyof({
    p: null,
    n: null,
    b: null,
    r: null,
    q: null,
  }), io.undefined]),
});
export type ChessMove = io.TypeOf<typeof chessMove>;

export const boardHistory = io.array(chessMove);
export type BoardHistory = io.TypeOf<typeof boardHistory>;

export const studyStateRecord = io.type({
  fen: io.string,

  // I think I should decide on one only - probably the pgn but we'll see
  // At least over te wire, then it can get reconverted
  pgn: io.string,
  history: boardHistory,
});
export type StudyStateRecord = io.TypeOf<typeof studyStateRecord>;

export const studyStateUpdatedPayload = io.type({
  kind: io.literal('stateUpdated'),
  content: studyStateRecord,
  peerId: io.string,
});
export type StudyStateUpdatedPayload = io.TypeOf<typeof studyStateUpdatedPayload>;

// This will be a union once there are most payloads
export const studyStatePayload = studyStateUpdatedPayload;
export type StudyStatePayload = io.TypeOf<typeof studyStatePayload>;
