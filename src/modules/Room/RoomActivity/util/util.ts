import { RoomMember } from '../../types';
import {
  toRoomPlayActivity,
  // toRoomPlayParticipants,
} from '../activities/PlayActivity/util';
import { toRoomAnalysisActivity } from '../activities/AnalysisActivity/util';
import { BaseRoomActivity } from '../redux/types';
import { RoomActivity, RoomActivityParticipant } from '../types';
import { UserInfoRecord } from 'dstnd-io';
import { toRoomRelayActivity } from '../activities/RelayActivity/utils';
import { console } from 'window-or-global';

export const toRoomActivity = (
  currentRoomActivity: BaseRoomActivity,
  members: RoomMember[]
): RoomActivity => {

  if (currentRoomActivity.type === 'play') {
    return toRoomPlayActivity(currentRoomActivity, members);
  }

  if (currentRoomActivity.type === 'analysis') {
    return toRoomAnalysisActivity(currentRoomActivity, members);
  }

  if (currentRoomActivity.type === 'relay'){
    return toRoomRelayActivity(currentRoomActivity, members);
  }

  return {
    ...currentRoomActivity,
    participants: undefined,
  } as const;
};

export const getParticipantUserInfo = (p: RoomActivityParticipant): UserInfoRecord => {
  return p.isPresent ? p.member.peer.user : p.user;
};
