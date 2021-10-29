import { AnalysisRecord, RoomAnalysisActivityRecord } from 'dstnd-io';
import { RoomActivitySpecifcParticipant, RoomRecordToRoomActivity } from '../../utilTypes';

export type RoomAnalysisActivityParticipant = RoomActivitySpecifcParticipant<
  'analysis',
  {
    // TBD
  }
>;

export type RoomAnalysisActivity = RoomRecordToRoomActivity<
  'analysis',
  RoomAnalysisActivityRecord & {
    analysis?: AnalysisRecord;
  },
  RoomAnalysisActivityParticipant
>;
