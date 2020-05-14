// export const Peer = {
//   id: '1',
//   name: 'Broasca',
// };
// import { Chess } from 'dstnd-io';
import Chance from 'chance';
import { RoomStatsRecord, PeerRecord } from 'dstnd-io';
import { range } from 'src/lib/util';
import { PeerRecordMock } from './PeerRecordMock';

const chance = new Chance();

const types = ['public', 'private'];

const peerMock = new PeerRecordMock();

const getPeersMap = (count: number) =>
  range(count)
    .map(() => peerMock.record())
    .reduce((r, next) => ({ ...r, [next.id]: next }), {});

export class RoomStatsRecordMock {
  record(
    peersCount = 4,
    peers = getPeersMap(peersCount),
  ): RoomStatsRecord {
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
    };
  }

  withProps(
    props: Partial<RoomStatsRecord>,
    peersCount?: number,
    peers?: Record<string, PeerRecord>,
  ): RoomStatsRecord {
    return {
      ...this.record(peersCount, peers),
      ...props.type === 'private' ? {
        type: 'private',
        code: props.code || chance.hash({ length: 6 }),
      } : {
        type: 'public',
      },
    };
  }

  get private() {
    return this.withProps({ type: 'private' });
  }

  get public() {
    return this.withProps({ type: 'public' });
  }
}
