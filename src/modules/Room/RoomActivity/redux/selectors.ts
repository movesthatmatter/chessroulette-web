import { RootState } from 'src/redux/rootReducer';
import { BaseRoomActivity } from './types';

export const selectCurrentRoomActivity = (s: RootState) => s.room.roomActivity as BaseRoomActivity;

export const selectGame = (state:RootState) => {
  const activity = state.room.roomActivity as BaseRoomActivity
  if (activity.type === 'play' || activity.type === 'lichess'){
    return activity.game
  }
  return undefined;
}