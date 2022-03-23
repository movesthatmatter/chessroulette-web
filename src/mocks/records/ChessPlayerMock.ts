// export const Peer = {
//   id: '1',
//   name: 'Broasca',
// };
// import { Chess } from 'chessroulette-io';
import Chance from 'chance';
import { ChessPlayer } from 'chessroulette-io';
import { UserInfoMocker } from './UserInfoMocker';
// import { ChessPlayer } from 'src/modules/Games/Chess';

const chance = new Chance();

const colors = ['white', 'black'];

const userInfoMock = new UserInfoMocker();

export class ChessPlayerMock {
  record(): ChessPlayer {
    return {
      color: colors[chance.integer({ min: 0, max: 1 })] as 'white' | 'black',
      user: userInfoMock.record(),
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
