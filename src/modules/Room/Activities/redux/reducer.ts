import { createReducer } from 'deox';
import {
  createRoomAction,
  updateMeAction,
  updateRoomAction,
} from 'src/providers/PeerProvider/redux/actions';
import { GenericStateSlice } from 'src/redux/types';
import {
  switchRoomActivityAction,
  updateJoinedGameAction,
  updateRoomActivityAction,
} from './actions';
import { RoomActivity } from './types';

export type State = RoomActivity;

export const initialState: State = {
  type: 'none',
};

export const reducer = createReducer(initialState as State, (handleAction) => [
  handleAction(switchRoomActivityAction, (_, { payload }) => payload),
  handleAction(updateRoomActivityAction, (_, { payload }) => payload),
  handleAction(createRoomAction, (_, { payload }) => payload.room.activity),
  handleAction(updateRoomAction, (prev, { payload }) => {
    // If the Activity Type changed just return the new activity
    if (payload.room.activity.type !== prev.type) {
      return payload.room.activity;
    }

    if (
      // And the activity is "Play"
      payload.room.activity.type === 'play' &&
      prev.type === 'play'
    ) {
      // But the Game Id has changed replace the old activity with the new
      if (payload.room.activity.gameId !== prev.gameId) {
        return payload.room.activity;
      }

      // Update for the Offer
      return {
        ...payload.room.activity,
        game: prev.game,
      };
    }

    if (
      // And the activity is "Analysis"
      payload.room.activity.type === 'analysis' &&
      prev.type === 'analysis' &&
      payload.room.activity.analysisId !== prev.analysisId
    ) {
      return payload.room.activity;
    }

    // Otherwise no need to create updates!
    return prev;
  }),

  // TODO: This should probably not be here. Need to think of a way
  //  to combine all the room related reducers!
  handleAction(updateMeAction, (prev, { payload }) => {
    if (!payload.me.hasJoinedRoom) {
      return {
        type: 'none',
      };
    }

    return prev;
  }),
  handleAction(updateJoinedGameAction, (prev, { payload: nextGame }) => {
    if (prev.type !== 'play') {
      return prev;
    }

    return {
      ...prev,
      game: nextGame,
    };
  }),
]);

export const stateSliceByKey = {
  roomActivity: reducer,
};

export type ModuleState = ReturnType<typeof reducer>;
export type ModuleStateSlice = GenericStateSlice<typeof stateSliceByKey, typeof reducer>;
