import { UserInfoRecord } from 'dstnd-io';
import { RoomMember } from '../../types';
import { RoomActivityParticipant } from '../types';

export const toRoomActivityPresentParticipant = (roomMember: RoomMember): RoomActivityParticipant => ({
  userId: roomMember.userId,
  isMe: roomMember.peer.isMe,
  isActivityParticipant: true,
  isPresent: true,
  member: roomMember,
});

export const toRoomActivityAbsentParticipant = (user: UserInfoRecord): RoomActivityParticipant => ({
  userId: user.id,
  isMe: false,
  isActivityParticipant: true,
  isPresent: false,
  user,
});
