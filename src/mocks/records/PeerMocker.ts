import Chance from 'chance';
import { Peer } from 'src/components/RoomProvider';

const chance = new Chance();

export class PeerMocker {
  record(): Peer {
    const id = String(chance.integer({ min: 1 }));

    return {
      id,
      name: chance.name(),
      avatarId: id.slice(-1)[0],
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
}
