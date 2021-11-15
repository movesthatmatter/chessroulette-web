import { RoomRelayActivityRecord } from 'dstnd-io';
import { Game } from 'src/modules/Games';
import { RoomActivitySpecifcParticipant, RoomRecordToRoomActivity } from '../../utilTypes';

export type RoomRelayActivityParticipant = RoomActivitySpecifcParticipant<
  'relay',
  {
    //TODO - add more priviledges for the streamer
  }
>;

// export type RoomRelayActivityWithGame = Omit<RoomRelayActivityRecord, 'gameId'> & {
//   game: Game;
// };

// export type RoomRelayActivityWithoutGame = Omit<RoomRelayActivityRecord, 'gameId'> & {
//   game?: undefined;
// };

// export type RoomActivityRecordWithOrWithoutGame =
//   | RoomRelayActivityWithGame
//   | RoomRelayActivityWithoutGame;

export type RoomRelayActivity = RoomRecordToRoomActivity<
  'relay',
  RoomRelayActivityRecord & {
    game?: Game
  },
  RoomRelayActivityParticipant
>