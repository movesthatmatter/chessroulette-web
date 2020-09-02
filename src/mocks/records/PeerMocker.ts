import Chance from 'chance';
import { Peer } from 'src/components/RoomProvider';
import { UserRecord } from 'dstnd-io';
import { UserRecordMocker } from './UserRecordMocker';

const chance = new Chance();

const userRecordMocker = new UserRecordMocker();

export class PeerMocker {
  record(): Peer {
    const id = String(chance.integer({ min: 1 }));

    return {
      id,
      user: userRecordMocker.record(),
      connection: {
        channels: {
          data: { on: false },
          streaming: { on: false },
        },
      },
    };
  }

  withProps(props: Partial<Peer>): Peer {
    return {
      ...this.record(),
      ...props,
    };
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
