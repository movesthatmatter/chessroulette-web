import { RoomAnalysisActivity } from 'src/modules/Room/RoomActivity/activities/AnalysisActivity/types';
import { AnalysisRecordMocker } from './AnalysisRecordMocker';
import { RoomActivityParticipantMocker } from './RoomActivityParticipant';
import { RoomAnalysisActivityParticipant } from 'src/modules/Room/RoomActivity/activities/AnalysisActivity/types';

const analysisRecordMocker = new AnalysisRecordMocker();

export class RoomActivityMocker {
  analysisActivity(): RoomAnalysisActivity {
    const participantMocker = new RoomActivityParticipantMocker();
    const myParticipant = participantMocker.withProps({ isPresent: true, isMe: true });
    const myAnalsyisParticipant: RoomAnalysisActivityParticipant = {
      roomActivitySpecificParticipantType: 'analysis',
      isRoomActivitySpecificParticipant: true,
      participant: myParticipant,
      userId: myParticipant.userId,
    } as const;

    const opponentParticipant = participantMocker.record({ isPresent: true });
    const opponentAnalysisParticipant = {
      roomActivitySpecificParticipantType: 'analysis',
      isRoomActivitySpecificParticipant: true,
      participant: opponentParticipant,
      userId: opponentParticipant.userId,
    } as const;

    const analysis = analysisRecordMocker.started();

    return {
      type: 'analysis',
      participants: {
        [myAnalsyisParticipant.userId]: myAnalsyisParticipant,
        [opponentAnalysisParticipant.userId]: opponentAnalysisParticipant,
      },
      analysisId: analysis.id,
      analysis,
    };
  }
}
