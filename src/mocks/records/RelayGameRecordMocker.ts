import { RelayedGameRecord } from 'chessroulette-io/dist/resourceCollections/relay/records';
import { Chance } from 'chance';
import { ChessGameStateMocker } from './ChessGameStateMocker';
import { GameRecord } from 'chessroulette-io';
import { toISODateTime } from 'io-ts-isodatetime';
import { Date } from 'window-or-global';

const chessGameStateMocker = new ChessGameStateMocker();
const chance = new Chance();

function relayGameStateToGameRecordState(
  state: RelayedGameRecord['gameState']
): GameRecord['state'] {
  return state === 'pending' ? 'pending' : state === 'started' ? 'started' : 'finished';
}

export class RelayGameRecordMocker {
  record(
    state: RelayedGameRecord['gameState'] = 'started',
    source: RelayedGameRecord['relaySource'] = 'proxy',
    label? :string
  ): RelayedGameRecord {
    return {
      id: chance.guid(),
      subscribedRoomIds: {},
      gameState: state,
      ...(label ? {label} : {}),
      game: {
        ...chessGameStateMocker.record(relayGameStateToGameRecordState(state)),
        id: chance.guid(),
        createdAt: toISODateTime(new Date()),
        updatedAt: toISODateTime(new Date()),
      },
      ...(source === 'proxy'
        ? {
            relaySource: 'proxy',
          }
        : {
            relaySource: 'room',
            relayingRoomId: chance.guid(),
          }),
    };
  }

  pendingFromProxy() {
    return this.record('pending', 'proxy');
  }
  startedFromProxy() {
    return this.record('started', 'proxy');
  }
  endedFromProxy() {
    return this.record('ended', 'proxy');
  }
  pendingFromRoom() {
    return this.record('pending', 'room');
  }
  startedFromRoom() {
    return this.record('started', 'room');
  }
  endedFromRoom() {
    return this.record('ended', 'room');
  }
  withRelayProps(props: Partial<RelayedGameRecord>) {
    return {
      ...this.record('started', 'proxy'),
      ...props,
    } as RelayedGameRecord;
  }
  withGameProps(props: Partial<GameRecord>) {
    const gameStateFromProps = chessGameStateMocker.withProps(props);
    return {
      ...this.record('started', 'proxy'),
      game: {
        ...gameStateFromProps,
        id: chance.guid(),
      },
    } as RelayedGameRecord;
  }
}
