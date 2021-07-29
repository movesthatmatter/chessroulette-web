import { RoomAnalysisActivity } from '../AnalysisActivity/types';
import { RoomNoActivity } from '../NoActivity/types';
import { RoomPlayActivity } from '../PlayActivity/types';

type WithoutParticipants<T> = Omit<T, 'participants'>;

export type BaseRoomNoActivity = WithoutParticipants<RoomNoActivity>;
export type BaseRoomPlayActivity = WithoutParticipants<RoomPlayActivity>;
export type BaseRoomAnalysisActivity = WithoutParticipants<RoomAnalysisActivity>;

export type BaseRoomActivity = BaseRoomNoActivity | BaseRoomPlayActivity | BaseRoomAnalysisActivity;
