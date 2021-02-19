import {
  ChessGameState,
  GameRecord,
} from 'dstnd-io';
import { ChessGameStateMocker } from './ChessGameStateMocker';
import { Chance } from 'chance';

const chessGameStateMocker = new ChessGameStateMocker();
const chance = new Chance();

export class GameRecordMocker {
  record(state: ChessGameState['state'] = 'pending'): GameRecord {
    return {
      id: chance.guid(),
      ...chessGameStateMocker.record(state),
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
    return {
      ...this.record(),
      ...props,
    } as GameRecord;
  }
}
