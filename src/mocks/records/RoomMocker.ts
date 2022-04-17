import Chance from 'chance';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { range } from 'src/lib/util';
import { PeerMocker } from './PeerMocker';
import { ClassRoom, Room } from 'src/modules/Room';
import { Peer } from 'src/providers/PeerConnectionProvider';

const chance = new Chance();
const peerMocker = new PeerMocker();

const getPeersMap = (count: number) =>
  range(count)
    .map(() => peerMocker.record())
    .reduce((r, next) => ({ ...r, [next.id]: next }), {});

export class RoomMocker {
  record(peersMapOrPeersCount: Record<string, Peer> | number = 4): Room {
    const isPrivate = chance.bool();
    const me = peerMocker.record();
    const peers =
      typeof peersMapOrPeersCount === 'number'
        ? getPeersMap(peersMapOrPeersCount)
        : peersMapOrPeersCount;

    return {
      id: String(chance.integer({ min: 1 })),
      name: String(chance.city()),
      slug: chance.hash({ length: 8 }),
      createdAt: toISODateTime(new Date()),
      createdBy: me.user.id,
      createdByUser: me.user,
      type: 'room',
      ...(isPrivate
        ? {
            isPrivate,
            code: chance.hash({ length: 6 }),
          }
        : {
            isPrivate,
            code: null,
          }),
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
      chatHistory: {
        id: String(chance.integer({ min: 1 })),
        usersInfo: {},
        messages: [],
      },
      pendingChallenges: {},
      p2pCommunicationType: 'none',
    };
  }

  withProps(props: Partial<Room>, peersMapOrPeersCount?: Record<string, Peer> | number): Room {
    const mergedRecord = {
      ...this.record(peersMapOrPeersCount),
      ...props,
    };

    const peersIncludingMe = {
      ...mergedRecord.peers,
      [mergedRecord.me.id]: mergedRecord.me,
    };

    return {
      ...mergedRecord,
      ...(!!props.isPrivate
        ? {
            isPrivate: true,
            code: props.code || chance.hash({ length: 6 }),
          }
        : {
            isPrivate: false,
            code: null,
          }),

      // Update the count
      peersCount: Object.keys(mergedRecord.peers).length,
      peersIncludingMe,
    };
  }

  classroom(peersMapOrPeersCount: Record<string, Peer> | number = 4): ClassRoom {
    return {
      ...this.record(peersMapOrPeersCount),
      type: 'classroom',
    };
  }

  get private() {
    return this.withProps({ isPrivate: true });
  }

  get public() {
    return this.withProps({ isPrivate: false });
  }
}
