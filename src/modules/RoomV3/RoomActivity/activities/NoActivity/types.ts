import { RoomNoActivityRecord } from 'dstnd-io';
import { RoomActivitySpecifcParticipant } from 'src/modules/Room/Activities/utilTypes';
// import { RoomActivitySpecifcParticipant } from '../utilTypes';

export type RoomNoActivityParticipantStats = undefined;

export type RoomNoActivityParticipant = RoomActivitySpecifcParticipant<'none'>;

export type RoomNoActivity = RoomNoActivityRecord & {
  participants: undefined;
};
