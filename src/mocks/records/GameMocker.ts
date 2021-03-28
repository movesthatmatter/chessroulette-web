import {
  ChessGameState,
  GameRecord,
  chessGameUtils,
} from 'dstnd-io';
import { Game } from 'src/modules/Games';
import { GameRecordMocker } from './GameRecordMocker';

const gameRecordMocker = new GameRecordMocker();

export class GameMocker {
  record(state: ChessGameState['state'] = 'pending'): Game {
    return {
      ...gameRecordMocker.record(state),
      captured: chessGameUtils.getCapturedPiecesFromPgn(''),
    };
  }

  pending() {
    return this.record('pending');
  }

  started() {
    return this.record('started');
  }

  finished() {
    return this.record('finished');
  }

  stopped() {
    return this.record('stopped');
  }

  neverStarted() {
    return this.record('neverStarted');
  }

  withProps(props: Partial<GameRecord>) {
    const gameRecordFromProps = gameRecordMocker.withProps(props);

    return {
      ...this.record(),
      ...gameRecordFromProps,
    } as Game;
  }
}
