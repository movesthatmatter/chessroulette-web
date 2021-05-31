import {
  ChessGameState,
  GameRecord,
  ChessGameStateFinished,
  ChessGameStateStopped,
  ChessGameStateNeverStarted,
  ChessGameStateStarted,
  ChessGameStatePending,
} from 'dstnd-io';
import { Game, GameFromGameState } from 'src/modules/Games';
import { GameRecordMocker } from './GameRecordMocker';

const gameRecordMocker = new GameRecordMocker();

export class GameMocker {
  record(state: ChessGameState['state'] = 'pending'): Game {
    return {
      ...gameRecordMocker.record(state),
      activePieces: {
        white: { p: 8, n: 2, b: 2, r: 2, q: 1 },
        black: { p: 8, n: 2, b: 2, r: 2, q: 1 },
      },
    };
  }

  pending() {
    return this.record('pending') as GameFromGameState<ChessGameStatePending>;
  }

  started() {
    return this.record('started') as GameFromGameState<ChessGameStateStarted>;
  }

  finished() {
    return this.record('finished') as GameFromGameState<ChessGameStateFinished>;
  }

  stopped() {
    return this.record('stopped') as GameFromGameState<ChessGameStateStopped>;
  }

  neverStarted() {
    return this.record('neverStarted') as GameFromGameState<ChessGameStateNeverStarted>;
  }

  withProps(props: Partial<GameRecord>) {
    const gameRecordFromProps = gameRecordMocker.withProps(props);

    return {
      ...this.record(),
      ...gameRecordFromProps,
    } as Game;
  }
}
