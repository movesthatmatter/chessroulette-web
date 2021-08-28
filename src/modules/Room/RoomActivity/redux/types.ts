import { RoomAnalysisActivity } from '../activities/AnalysisActivity/types';
import { RoomNoActivity } from '../activities/NoActivity/types';
import { RoomLichessActivity, RoomPlayActivity } from '../activities/PlayActivity/types';

type WithoutParticipants<T> = Omit<T, 'participants'>;

export type BaseRoomNoActivity = WithoutParticipants<RoomNoActivity>;
export type BaseRoomPlayActivity = WithoutParticipants<RoomPlayActivity>;
export type BaseRoomAnalysisActivity = WithoutParticipants<RoomAnalysisActivity>;
export type BaseRoomLichessActivity = WithoutParticipants<RoomLichessActivity>;

export type BaseRoomActivity = BaseRoomNoActivity | BaseRoomPlayActivity | BaseRoomAnalysisActivity | BaseRoomLichessActivity;
