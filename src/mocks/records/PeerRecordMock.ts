// export const Peer = {
//   id: '1',
//   name: 'Broasca',
// };
import { PeerRecord } from 'dstnd-io';
import Chance from 'chance';

const chance = new Chance();

export class PeerRecordMock {
  record(): PeerRecord {
    return {
      id: String(chance.integer({ min: 1 })),
      name: chance.name(),
    };
  }

  withProps(props: Partial<PeerRecord>): PeerRecord {
    return {
      ...this.record(),
      ...props,
    };
  }
}
