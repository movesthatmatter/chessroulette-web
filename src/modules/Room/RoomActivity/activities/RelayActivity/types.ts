import { ResourceRecords, RoomRelayActivityRecord } from 'chessroulette-io';
import { Game } from 'src/modules/Games';
import { RoomActivitySpecifcParticipant, RoomRecordToRoomActivity } from '../../utilTypes';

export type RoomRelayActivityParticipant = RoomActivitySpecifcParticipant<
  'relay',
  {
    //TODO - add more priviledges for the streamer
  }
>;

export type RoomRelayActivity = RoomRecordToRoomActivity<
  'relay',
  RoomRelayActivityRecord & {
    game?: Game;
    label?: string;
  },
  RoomRelayActivityParticipant
>;

export type RelayedGameRecord = ResourceRecords.Relay.RelayedGameRecord;

export type RelayedGame = RelayedGameRecord & { game: Game };
