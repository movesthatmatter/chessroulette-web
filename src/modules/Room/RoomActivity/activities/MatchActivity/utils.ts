import { RoomMatchActivityRecord, RoomPlayActivityRecord } from 'dstnd-io';

export const roomMatchActivityToPlayActivityRecord = (
  activity: RoomMatchActivityRecord
): RoomPlayActivityRecord => ({
  type: 'play',
  gameId: activity.match.gameId,
});
