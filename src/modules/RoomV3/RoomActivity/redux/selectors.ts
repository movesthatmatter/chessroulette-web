import { RootState } from 'src/redux/rootReducer';
import { BaseRoomActivity } from './types';

export const selectCurrentRoomActivity = (s: RootState) => s.room.roomActivity as BaseRoomActivity;
