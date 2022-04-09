import { RoomAnalysisActivity } from '../activities/AnalysisActivity/types';
import { RoomNoActivity } from '../activities/NoActivity/types';
import { RoomPlayActivity } from '../activities/PlayActivity/types';
import { RoomRelayActivity } from '../activities/RelayActivity/types';
import { RoomWarGameActivity } from '../activities/WarGameActivity/types';
// import { RoomMatchActivity } from '../activities/MatchActivity/types';

type WithoutParticipants<T> = Omit<T, 'participants'>;

export type BaseRoomNoActivity = WithoutParticipants<RoomNoActivity>;
export type BaseRoomPlayActivity = WithoutParticipants<RoomPlayActivity>;
export type BaseRoomAnalysisActivity = WithoutParticipants<RoomAnalysisActivity>;
export type BaseRoomRelayActivity = WithoutParticipants<RoomRelayActivity>;
export type BaseRoomWarGameActivity = WithoutParticipants<RoomWarGameActivity>;
// export type BaseRoomMatchActivity = WithoutParticipants<RoomMatchActivity>;

export type BaseRoomActivity =
	| BaseRoomNoActivity
	| BaseRoomPlayActivity
	| BaseRoomAnalysisActivity
	| BaseRoomRelayActivity
	| BaseRoomWarGameActivity
	// | BaseRoomMatchActivity;
