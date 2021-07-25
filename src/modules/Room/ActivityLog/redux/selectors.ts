import { ISODateTimeToTimestamp } from 'src/lib/date';
import { ModuleStateSlice } from './reducer';

export const selectCurrentRoomActivityLog = (s: ModuleStateSlice) => s.roomActivityLog.currentRoom;

export const selectCurrentRoomActivityLogHistoryOrderedArray = 
(s: ModuleStateSlice) => Object.values(s.roomActivityLog.currentRoom.history).sort((d1, d2) => {
  return ISODateTimeToTimestamp(d1.timestamp) - ISODateTimeToTimestamp(d2.timestamp)
});