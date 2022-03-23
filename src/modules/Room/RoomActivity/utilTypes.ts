import { RoomActivityRecord } from 'chessroulette-io';
import { RoomActivityParticipant } from './types';

export type RoomActivitySpecifcParticipant<
  TActivityType extends RoomActivityRecord['type'],
  T extends object = {}
> = {
  isRoomActivitySpecificParticipant: true;
  roomActivitySpecificParticipantType: TActivityType;
  participant: RoomActivityParticipant;
  userId: RoomActivityParticipant['userId'];
} & T;

export type RoomActivityParticipants<TParticipant extends object | undefined = undefined> = {
  [userId: string]: TParticipant;
};

export type RoomRecordToRoomActivity<
  TActivityType extends RoomActivityRecord['type'],
  TActivityRecord extends object = {},
  TSpecificParticipantObject extends object = {}
> = Omit<TActivityRecord, 'type'> & {
  type: TActivityType;
  participants: RoomActivityParticipants<
    RoomActivitySpecifcParticipant<TActivityType, TSpecificParticipantObject>
  >;
};
