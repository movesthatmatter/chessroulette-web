import {
  WarGameState
} from 'chessroulette-io';
import { chessGameTimeLimitMsMap } from 'chessroulette-io/dist/metadata/game';
import { Game, GameFromGameState, WarGame } from 'src/modules/Games';
import { WarGameRecordMocker } from './WarGameRecordMocker';

const warGameMocker = new WarGameRecordMocker();

export class WarGameMocker {
  record(state: WarGameState['state'] = 'pending'): WarGame {
    return {
      ...warGameMocker.record(state),
    };
  }

  pending() {
    return this.record('pending') as WarGame;
  }

  started() {
    return this.record('started') as WarGame;
  }

  finished() {
    return this.record('finished') as WarGame;
  }

  stopped() {
    return this.record('stopped') as WarGame;
  }

  neverStarted() {
    return this.record('neverStarted') as WarGame;
  }
}
