import Chance from 'chance';
import { Room, Peer } from 'src/components/RoomProvider';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { range } from 'src/lib/util';
import { PeerMocker } from './PeerMocker';
import { RoomStatsRecordMocker } from './RoomStatsRecordMocker';

const chance = new Chance();
const peerMocker = new PeerMocker();
// const roomStatsMocker = new RoomStatsRecordMocker();
const types = ['public', 'private'];

const getPeersMap = (count: number) =>
  range(count)
    .map(() => peerMocker.record())
    .reduce((r, next) => ({ ...r, [next.id]: next }), {});

export class RoomMocker {
  record(
    peersMapOrPeersCount: Record<string, Peer> | number = 4,
  ): Room {
    // const roomStatsRecord = roomStatsMocker.record(peersMapOrPeersCount);
    const type = types[chance.integer({ min: 0, max: 1 })] as 'public' | 'private';
    const me = peerMocker.record();
    const peers = typeof peersMapOrPeersCount === 'number'
      ? getPeersMap(peersMapOrPeersCount)
      : peersMapOrPeersCount;


    return {
      id: String(chance.integer({ min: 1 })),
      name: String(chance.city()),
      slug: chance.hash({ length: 8 }),
      createdAt: toISODateTime(new Date()),
      createdBy: Object.values(peers)[0]?.id || '-1',
      ...type === 'private' ? {
        type,
        code: chance.hash({ length: 6 }),
      } : {
        type,
        code: null,
      },
      activity: {
        type: 'none',
      },
      me,
      peers,
      peersCount: Object.keys(peers).length,
      peersIncludingMe: {
        ...peers,
        ...{
          [me.id]: me,
        },
      },
    };
  }

  withProps(
    props: Partial<Room>,
    peersMapOrPeersCount?: Record<string, Peer> | number,
  ): Room {
    const mergedRecord = {
      ...this.record(peersMapOrPeersCount),
      ...props,
    };

    const peersIncludingMe = {
      ...mergedRecord.peers,
      [mergedRecord.me.id]: mergedRecord.me,
    }

    return {
      ...mergedRecord,
      ...props.type === 'private' ? {
        type: 'private',
        code: props.code || chance.hash({ length: 6 }),
      } : {
        type: 'public',
        code: null,
      },

      // Update the count
      peersCount: Object.keys(mergedRecord.peers).length,
      peersIncludingMe,
    };
  }

  get private() {
    return this.withProps({ type: 'private' });
  }

  get public() {
    return this.withProps({ type: 'public' });
  }
}
