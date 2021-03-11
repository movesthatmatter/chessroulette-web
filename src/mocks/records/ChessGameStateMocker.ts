import {
  ChessGameState,
  ChessGameStateFinished,
  ChessGameStateNeverStarted,
  ChessGameStatePending,
  ChessGameStateStarted,
  ChessGameStateStopped,
  ChessPlayerBlack,
  ChessPlayerWhite,
} from 'dstnd-io';
import { UserRecordMocker } from './UserRecordMocker';
import { toISODateTime } from 'io-ts-isodatetime';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';

const userRecordMock = new UserRecordMocker();

export class ChessGameStateMocker {
  record(state: ChessGameState['state'] = 'pending'): ChessGameState {
    const whitePlayer: ChessPlayerWhite = {
      color: 'white',
      user: userRecordMock.record(),
    };
    const blackPlayer: ChessPlayerBlack = {
      color: 'black',
      user: userRecordMock.record(),
    };

    const pending: ChessGameStatePending = {
      state: 'pending',
      timeLimit: 'blitz',
      timeLeft: {
        white: chessGameTimeLimitMsMap.blitz,
        black: chessGameTimeLimitMsMap.blitz,
      },
      pgn: undefined,
      players: [whitePlayer, blackPlayer],
      winner: undefined,
      lastMoveBy: undefined,
      lastMoveAt: undefined,
      captured: undefined,
    };

    const started: ChessGameStateStarted = {
      ...pending,
      state: 'started',
      pgn: '1. e4 e5 2. Qf3 Na6',
      winner: undefined,
      lastMoveBy: 'white',
      lastMoveAt: toISODateTime(new Date()),
      captured: {
        white: {
          p: 0,
          n: 0,
          b: 0,
          q: 0,
          r: 0,
        },
        black: {
          p: 0,
          n: 0,
          b: 0,
          q: 0,
          r: 0,
        },
      },
    };

    if (state === 'pending') {
      return pending;
    } else if (state === 'neverStarted') {
      return {
        ...pending,
        state: 'neverStarted',
      };
    } else if (state === 'finished') {
      return {
        ...started,
        state: 'finished',
        pgn: '1. e4 e5 2. Qf3 Na6 3. Bc4 h6 4. Qxf7#',
        winner: 'white',
        captured: {
          ...started.captured,
          white: {
            ...started.captured.white,
            p: 1,
          },
        },
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

  pending(): ChessGameStatePending {
    return this.record('pending') as ChessGameStatePending;
  }

  started(): ChessGameStateStarted {
    return this.record('started') as ChessGameStateStarted;
  }

  finished(): ChessGameStateFinished {
    return this.record('finished') as ChessGameStateFinished;
  }

  stopped(): ChessGameStateStopped {
    return this.record('stopped') as ChessGameStateStopped;
  }

  neverStarted(): ChessGameStateNeverStarted {
    return this.record('neverStarted') as ChessGameStateNeverStarted;
  }

  withProps(props: Partial<ChessGameState>): ChessGameState {
    return {
      ...this.record(),
      ...props,
    } as ChessGameState;
  }
}
