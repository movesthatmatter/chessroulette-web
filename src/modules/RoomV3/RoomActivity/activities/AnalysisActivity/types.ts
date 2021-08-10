import { RoomAnalysisActivityRecord } from 'dstnd-io';
import { Game } from 'src/modules/Games';
import { RoomActivitySpecifcParticipant, RoomRecordToRoomActivity } from '../../utilTypes';
// import { RoomActivitySpecifcParticipant, RoomRecordToRoomActivity } from 'src/modules/Room/Activities/utilTypes';
// import { RoomActivitySpecifcParticipant, RoomRecordToRoomActivity } from '../utilTypes';

export type RoomAnalysisActivityParticipant = RoomActivitySpecifcParticipant<
  'analysis',
  {
    // TBD
  }
>;

export type RoomAnalysisActivity = RoomRecordToRoomActivity<
  'analysis',
  Omit<RoomAnalysisActivityRecord, 'analysisId'> & {
    analysis?: {
      id: string;
      history: Game['history'];
    };
  },
  RoomAnalysisActivityParticipant
>;
