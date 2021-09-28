import { UserInfoRecord } from 'dstnd-io';
import { RoomMember } from '../../types';
import { RoomActivityParticipant } from '../types';
import deepCopy from 'deep-copy';

export const toRoomActivityPresentParticipant = (roomMember: RoomMember): RoomActivityParticipant => ({
  userId: roomMember.userId,
  isMe: roomMember.peer.isMe,
  isActivityParticipant: true,
  isPresent: true,
  // Ensure this creates a new object so React triggers a render correctly
  member: deepCopy(roomMember),
});

export const toRoomActivityAbsentParticipant = (user: UserInfoRecord): RoomActivityParticipant => ({
  userId: user.id,
  isMe: false,
  isActivityParticipant: true,
  isPresent: false,
  // Ensure this creates a new object so React triggers a render correctly
  user: deepCopy(user),
});
