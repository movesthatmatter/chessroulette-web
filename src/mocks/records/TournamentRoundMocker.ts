import { Chance } from 'chance';
import { RelayedGameRecord } from 'dstnd-io/dist/resourceCollections/relay/records';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { TournamentRound } from 'src/modules/Relay/BroadcastPage/types';
import { Array, Date } from 'window-or-global';
import { RelayGameRecordMocker } from './RelayGameRecordMocker';
import { StreamerRecordMocker } from './StreamerRecordMocker';

const streamersMocker = new StreamerRecordMocker();
const relaysMocker = new RelayGameRecordMocker();
const chance = new Chance();

export class TournamentRoundMocker {
  public record(state: RelayedGameRecord['gameState'], label?: string): TournamentRound {

    return {
      relay: relaysMocker.record(state, 'proxy', label),
      streamers: Array((Math.random() > 0.5) ? 2 : 1).fill(null).map((_) => streamersMocker.record(false)),
      date: toISODateTime(new Date()),
      id: chance.guid()
    }
  }
}
