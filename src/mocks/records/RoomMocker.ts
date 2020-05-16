import Chance from 'chance';
import { Room, Peer } from 'src/components/RoomProvider';
import { PeerMocker } from './PeerMocker';
import { RoomStatsRecordMocker } from './RoomStatsRecordMocker';

const chance = new Chance();
const peerMocker = new PeerMocker();
const roomStatsMocker = new RoomStatsRecordMocker();

export class RoomMocker {
  record(
    peersMapOrPeersCount?: Record<string, Peer> | number,
  ): Room {
    const roomStatsRecord = roomStatsMocker.record(peersMapOrPeersCount);

    return {
      ...roomStatsRecord,
      me: peerMocker.record(),
      peers: Object.values(roomStatsRecord.peers).reduce((accum, peer) => ({
        ...accum,
        [peer.id]: peerMocker.record(),
      }), {}),
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
