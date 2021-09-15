import { ISODateTimeToTimestamp } from 'src/lib/date';
import { RootState } from 'src/redux/rootReducer';
import { ModuleStateSlice } from './reducer';

export const selectCurrentRoomActivityLog = (s: RootState) => s.room.roomActivityLog.currentRoom;

export const selectCurrentRoomActivityLogHistoryOrderedArray = 
(s: RootState) => Object.values(s.room.roomActivityLog.currentRoom.history).sort((d1, d2) => {
  return ISODateTimeToTimestamp(d1.timestamp) - ISODateTimeToTimestamp(d2.timestamp)
});