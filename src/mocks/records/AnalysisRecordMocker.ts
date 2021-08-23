import { AnalysisRecord } from 'dstnd-io';
import { Chance } from 'chance';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { GameMocker } from './GameMocker';

const gameMocker = new GameMocker();
const chance = new Chance();

export class AnalysisRecordMocker {
  record(pgn = ''): AnalysisRecord {
    const history = gameMocker.withPgn(pgn).history || [];

    return {
      id: chance.guid(),
      history: history,
      focusIndex: history.length - 1,
      createdAt: toISODateTime(new Date()),
      updatedAt: toISODateTime(new Date()),
    };
  }

  started() {
    return this.record('1. e4 e5 2. Qf3 Na6');
  }
}
