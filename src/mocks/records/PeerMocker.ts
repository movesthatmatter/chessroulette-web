import Chance from 'chance';
import { Peer } from 'src/components/RoomProvider';
import { PeerRecord, UserRecord } from 'dstnd-io';
import { UserRecordMocker } from './UserRecordMocker';
import { PeerRecordMock } from './PeerRecordMock';
import { ISODateTime, toISODateTime } from 'src/lib/date/ISODateTime';

const chance = new Chance();

const userRecordMocker = new UserRecordMocker();
const peerRecordMocker = new PeerRecordMock();

export class PeerMocker {
  record(): Peer {
    const userRecord = userRecordMocker.record();
    const peerRecord = peerRecordMocker.withProps({ id: userRecord.id });

    return {
      ...peerRecord,
      user: userRecord,
      connection: {
        channels: {
          data: { on: false },
          streaming: { on: false },
        },
      },
    };
  }

  withProps(props: Partial<Peer>): Peer {
    const record = {
      ...this.record(),
      ...props,
      ...(props.hasJoinedRoom) ? {
        hasJoinedRoom: true,
        joinedRoomAt: props.joinedRoomAt || toISODateTime(new Date()),
        joinedRoomId: props.joinedRoomId || String(chance.integer({ min: 1, max: 999 })),
      } : {
        hasJoinedRoom: false,
        joinedRoomAt: null,
        joinedRoomId: null,
      }
    };

    return {
      ...record,
      // Ensure the peer id and user id stay the same
      id: record.user.id,
    } as Peer;
  }

  withChannels(channels: Partial<Peer['connection']['channels']>) {
    const record = this.record();

    return {
      ...record,
      connection: {
        ...record.connection,
        channels: {
          ...record.connection.channels,
          ...channels,
        },
      },
    };
  }

  withUserInfoProps(userInfoProps: Partial<UserRecord>): Peer {
    return this.withProps({
      user: userRecordMocker.withProps(userInfoProps),
    });
  }
}
