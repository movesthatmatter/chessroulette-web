import Chance from 'chance';
import { RoomStatsRecord } from 'dstnd-io';
import { RoomMocker } from './RoomMocker';
import { Peer } from 'src/providers/PeerProvider';

const chance = new Chance();
const roomMocker = new RoomMocker();

export class RoomStatsRecordMocker {
  record(
    peersMapOrPeersCount: Record<string, Peer> | number = 4,
  ): RoomStatsRecord {
    // At this point the RoomStatsRecord is a subset of Room,
    // using PeerRecord instead of Peers and not having a bunch 
    // of client side props, but for the purpose of mocking is ok
    // to not have to deal with removing them
    return roomMocker.record(peersMapOrPeersCount);
  }

  withProps(
    props: Partial<RoomStatsRecord>,
    peersMapOrPeersCount: Record<string, Peer> | number = 4,
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
        code: null,
      },
    }
  }

  get private() {
    return this.withProps({ type: 'private' });
  }

  get public() {
    return this.withProps({ type: 'public' });
  }
}
