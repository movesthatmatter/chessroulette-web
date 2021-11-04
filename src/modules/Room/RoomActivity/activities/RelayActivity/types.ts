import { RoomRelayActivityRecord } from 'dstnd-io';
import { Game } from 'src/modules/Games';
import { RoomActivitySpecifcParticipant, RoomRecordToRoomActivity } from '../../utilTypes';

export type RoomRelayActivityParticipant = RoomActivitySpecifcParticipant<'relay', {

}>

export type RoomRelayActivityWithGameAndParticipating = RoomRelayActivityRecord & {
  game: Game;
  iamParticipating: true;
}

export type RoomRelayActivityWithGameButNotParticipating = RoomRelayActivityRecord & {
  game: Game;
  iamParticipating: false;
}

export type RoomRelayActivity = RoomRelayActivityWithGameAndParticipating | RoomRelayActivityWithGameButNotParticipating;
