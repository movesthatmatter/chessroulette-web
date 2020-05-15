// export const Peer = {
//   id: '1',
//   name: 'Broasca',
// };
// import { Chess } from 'dstnd-io';
import Chance from 'chance';
import { ChessPlayer } from 'src/modules/Games/Chess';

const chance = new Chance();

const colors = ['white', 'black'];

export class ChessPlayerMock {
  record(): ChessPlayer {
    return {
      id: String(chance.integer({ min: 1 })),
      name: String(chance.name()),
      color: colors[chance.integer({ min: 0, max: 1 })] as 'white' | 'black',
    };
  }

  withProps(props: Partial<ChessPlayer>): ChessPlayer {
    return {
      ...this.record(),
      ...props,
    };
  }

  get black() {
    return this.withProps({ color: 'black' });
  }

  get white() {
    return this.withProps({ color: 'white' });
  }
}
