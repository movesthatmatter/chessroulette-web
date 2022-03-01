import { PiecesPositions, WarGameHistory, WarGamePlayer, WarGamePlayerBlack, WarGamePlayerWhite, WarGameState, WarGameStateFinished, WarGameStateNeverStarted, WarGameStatePending, WarGameStateStarted, WarGameStateStopped } from 'chessroulette-io';
import { UserRecordMocker } from './UserRecordMocker';
import { toISODateTime } from 'io-ts-isodatetime';
import { chessGameTimeLimitMsMap } from 'chessroulette-io/dist/metadata/game';

const userRecordMock = new UserRecordMocker();

export const defaultPiecesPositions: PiecesPositions = {
  bR0: 'a8',
  bN0: 'b8',
  bB0: 'c8',
  bQ0: 'd8',
  bK0: 'e8',
  bB1: 'f8',
  bN1: 'g8',
  bR1: 'h8',
  bP0: 'a7',
  bP1: 'b7',
  bP2: 'c7',
  bP3: 'd7',
  bP4: 'e7',
  bP5: 'f7',
  bP6: 'g7',
  bP7: 'h7',
  wR0: 'a1',
  wN0: 'b1',
  wB0: 'c1',
  wQ0: 'd1',
  wK0: 'e1',
  wB1: 'f1',
  wN1: 'g1',
  wR1: 'h1',
  wP0: 'a2',
  wP1: 'b2',
  wP2: 'c2',
  wP3: 'd2',
  wP4: 'e2',
  wP5: 'f2',
  wP6: 'g2',
  wP7: 'h2',
};

export const deafaultHealts = {
  bR0: 10,
  bN0: 6,
  bB0: 6,
  bQ0: 18,
  bK0: 30,
  bB1: 6,
  bN1: 6,
  bR1: 10,
  bP0: 2,
  bP1: 2,
  bP2: 2,
  bP3: 2,
  bP4: 2,
  bP5: 2,
  bP6: 2,
  bP7: 2,
  wR0: 10,
  wN0: 6,
  wB0: 6,
  wQ0: 18,
  wK0: 30,
  wB1: 6,
  wN1: 6,
  wR1: 10,
  wP0: 2,
  wP1: 2,
  wP2: 2,
  wP3: 2,
  wP4: 2,
  wP5: 2,
  wP6: 2,
  wP7: 2,
};

export class WarGameStateMocker {
  record(state: WarGameState['state'] = 'pending'): WarGameState {
    const whitePlayer: WarGamePlayerWhite = {
      color: 'white',
      user: userRecordMock.record(),
    };
    const blackPlayer: WarGamePlayerBlack = {
      color: 'black',
      user: userRecordMock.record(),
    };

    const pending: WarGameStatePending = {
      state: 'pending',
      pieces: {
        positions: defaultPiecesPositions,
        healths: deafaultHealts
      },
      timeLimit: 'blitz5',
      timeLeft: {
        white: chessGameTimeLimitMsMap.blitz3,
        black: chessGameTimeLimitMsMap.blitz3,
      },
      history: undefined,
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      players: [whitePlayer, blackPlayer],
      winner: undefined,
      lastMoveBy: undefined,
      lastMoveAt: undefined,

      startedAt: undefined,
      lastActivityAt: undefined,
    };

    const startedfen = 'rnbqkbnr/ppppppp1/8/7p/6P1/7P/PPPPPP2/RNBQKBNR b KQkq - 0 2';
    const now = new Date();

    const started: WarGameStateStarted = {
      ...pending,
      state: 'started',
      fen: startedfen,
      history: [
        {
          move: {from: 'g2', to: 'g4'},
          type: 'range',
          rooksMoved: {
            wR0: false, wR1: false, bR0: false, bR1: false
          },
          clock: 5000,
          color: 'white'
        },
        {
          move: {from: 'h7', to: 'h5'},
          type: 'range',
          rooksMoved: {
            wR0: false, wR1: false, bR0: false, bR1: false
          },
          clock: 49000,
          color: 'black'
        },
        {
          move: {from: 'h2', to: 'h3'},
          type: 'range',
          rooksMoved: {
            wR0: false, wR1: false, bR0: false, bR1: false
          },
          clock: 4800,
          color: 'white'
        }
      ],
      winner: undefined,
      lastMoveBy: 'white',
      lastMoveAt: toISODateTime(now),

      startedAt: toISODateTime(now),
      lastActivityAt: toISODateTime(now),
    };

    if (state === 'pending') {
      return pending;
    } else if (state === 'neverStarted') {
      return {
        ...pending,
        state: 'neverStarted',
        lastActivityAt: toISODateTime(now),
      };
    } else if (state === 'finished') {
      const finishedFen = 'rnbqkbn1/pppppppr/8/7p/6P1/7P/PPPPPP2/RNBQKBNR w KQq - 1 3';

      return {
        ...started,
        state: 'finished',
        fen: finishedFen,
        history:[
          {
            move: {from: 'g2', to: 'g4'},
            type: 'range',
            rooksMoved: {
              wR0: false, wR1: false, bR0: false, bR1: false
            },
            clock: 5000,
            color: 'white'
          },
          {
            move: {from: 'h7', to: 'h5'},
            type: 'range',
            rooksMoved: {
              wR0: false, wR1: false, bR0: false, bR1: false
            },
            clock: 49000,
            color: 'black'
          },
          {
            move: {from: 'h2', to: 'h3'},
            type: 'range',
            rooksMoved: {
              wR0: false, wR1: false, bR0: false, bR1: false
            },
            clock: 4800,
            color: 'white'
          },
          {
            move: {from: 'h8', to: 'h7'},
            type: 'range',
            rooksMoved: {
              wR0: false, wR1: false, bR0: false, bR1: true
            },
            clock: 45000,
            color: 'black'
          },
        ],
        winner: 'white',
      };
    } else if (state === 'stopped') {
      return {
        ...started,
        state: 'stopped',
        winner: 'black',
      };
    } else if (state === 'started') {
      return started;
    }

    return pending;
  }

  pending(): WarGameStatePending {
    return this.record('pending') as WarGameStatePending;
  }

  started(): WarGameStateStarted {
    return this.record('started') as WarGameStateStarted;
  }

  finished(): WarGameStateFinished {
    return this.record('finished') as WarGameStateFinished;
  }

  stopped(): WarGameStateStopped {
    return this.record('stopped') as WarGameStateStopped;
  }

  neverStarted(): WarGameStateNeverStarted {
    return this.record('neverStarted') as WarGameStateNeverStarted;
  }
}
