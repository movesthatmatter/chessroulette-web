import {
  ChessGameState,
  GameRecord,
  WarGameRecord,
  WarGameState,
} from 'chessroulette-io';
import { WarGameStateMocker } from './WarGameStateMocker';
import { Chance } from 'chance';
import { toISODateTime } from 'src/lib/date/ISODateTime';

const warGameStateMocker = new WarGameStateMocker();
const chance = new Chance();

export class WarGameRecordMocker {
  record(state: WarGameState['state'] = 'pending'): WarGameRecord {
    return {
      id: chance.guid(),
      ...warGameStateMocker.record(state),
      createdAt: toISODateTime(new Date()),
      updatedAt: toISODateTime(new Date()),
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
}
