import {
  ChessGameState,
  ChessGameStateFinished,
  ChessGameStateNeverStarted,
  ChessGameStatePending,
  ChessGameStateStarted,
  ChessGameStateStopped,
  ChessHistory,
  ChessPlayerBlack,
  ChessPlayerWhite,
} from 'dstnd-io';
import { UserRecordMocker } from './UserRecordMocker';
import { toISODateTime } from 'io-ts-isodatetime';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import { getNewChessGame } from 'src/modules/Games/Chess/lib';
import { getRandomInt } from 'src/lib/util';

const userRecordMock = new UserRecordMocker();

export const pgnToChessHistory = (
  pgn: string,
  timeLimit: {
    white: number;
    black: number;
  },
  clockRange: {
    minSeconds: number;
    maxSeconds: number;
  } = {
    minSeconds: 0,
    maxSeconds: 3,
  }
): ChessHistory => {
  const instance = getNewChessGame(pgn);

  const r = instance.history({ verbose: true }).reduce(
    (prev, { promotion, ...move }) => {
      const color = move.color === 'b' ? 'black' : 'white';
      const clock = prev.clocks[color] - (getRandomInt(clockRange.minSeconds, clockRange.maxSeconds) * 1000);

      return {
        ...prev,
        clocks: {
          ...prev.clocks,
          [color]: clock,
        },
        moves: [
          ...prev.moves,
          {
            ...move,
            color: move.color === 'b' ? 'black' : 'white',
            clock,
            ...(promotion &&
              promotion !== 'k' && {
                promotion,
              }),
          } as const,
        ],
      };
    },
    {
      clocks: timeLimit,
      moves: [] as ChessHistory,
    }
  );

  return r.moves;
};

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
      timeLimit: 'blitz5',
      timeLeft: {
        white: chessGameTimeLimitMsMap.blitz3,
        black: chessGameTimeLimitMsMap.blitz3,
      },
      history: undefined,
      pgn: undefined,
      players: [whitePlayer, blackPlayer],
      winner: undefined,
      lastMoveBy: undefined,
      lastMoveAt: undefined,

      startedAt: undefined,
      lastActivityAt: undefined,
    };

    const startedPgn = '1. e4 e5 2. Qf3 Na6';
    const now = new Date();

    const started: ChessGameStateStarted = {
      ...pending,
      state: 'started',
      pgn: startedPgn,
      history: pgnToChessHistory(startedPgn, {
        white: chessGameTimeLimitMsMap.blitz3,
        black: chessGameTimeLimitMsMap.blitz3,
      }),
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
      const finishedPgn = '1. e4 e5 2. Qf3 Na6 3. Bc4 h6 4. Qxf7#';

      return {
        ...started,
        state: 'finished',
        pgn: finishedPgn,
        history: pgnToChessHistory(finishedPgn, {
          white: chessGameTimeLimitMsMap.blitz3,
          black: chessGameTimeLimitMsMap.blitz3,
        }),
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
    const mergedGameState = {
      ...this.record(),
      ...props,
    };

    return {
      ...mergedGameState,
      ...(props.pgn && {
        history: pgnToChessHistory(props.pgn, {
          white: chessGameTimeLimitMsMap[mergedGameState.timeLimit],
          black: chessGameTimeLimitMsMap[mergedGameState.timeLimit],
        }),
      }),
    } as ChessGameState;
  }
}
