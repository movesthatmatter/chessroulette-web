import Chance from 'chance';
import { RoomStatsRecord, PeerRecord } from 'dstnd-io';
import { range } from 'src/lib/util';
import { prepareGameAction } from 'dstnd-io/dist/chessGame/chessGameStateReducer';
import { PeerRecordMock } from './PeerRecordMock';

const chance = new Chance();

const types = ['public', 'private'];

const peerMock = new PeerRecordMock();

const getPeersMap = (count: number) =>
  range(count)
    .map(() => peerMock.record())
    .reduce((r, next) => ({ ...r, [next.id]: next }), {});

export class RoomStatsRecordMocker {
  record(
    peersMapOrPeersCount: Record<string, PeerRecord> | number = 4,
  ): RoomStatsRecord {
    const peers = typeof peersMapOrPeersCount === 'number'
      ? getPeersMap(peersMapOrPeersCount)
      : peersMapOrPeersCount;

    const type = types[chance.integer({ min: 0, max: 1 })] as 'public' | 'private';

    return {
      id: String(chance.integer({ min: 1 })),
      name: String(chance.city()),
      ...type === 'private' ? {
        type,
        code: chance.hash({ length: 6 }),
      } : {
        type,
      },
      peersCount: Object.keys(peers).length,
      peers,

      // This is an opponentWaitingGame
      game: prepareGameAction({
        timeLimit: 'blitz',
        players: [Object.values(peers)[0].user],
      }),
    };
  }

  withProps(
    props: Partial<RoomStatsRecord>,
    peersMapOrPeersCount: Record<string, PeerRecord> | number = 4,
  ): RoomStatsRecord {
    const mergedRecord = {
      ...this.record(peersMapOrPeersCount),
      ...props,
    };

    return {
      ...mergedRecord,
      ...props.type === 'private' ? {
        type: 'private',
        code: props.code || chance.hash({ length: 6 }),
      } : {
        type: 'public',
      },

      // Update the count
      peersCount: Object.keys(mergedRecord.peers).length,
    };
  }

  get private() {
    return this.withProps({ type: 'private' });
  }

  get public() {
    return this.withProps({ type: 'public' });
  }
}
