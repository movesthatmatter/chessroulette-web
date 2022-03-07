import { createReducer } from 'deox';
import {
  createRoomAction,
  updateMeAction,
  updateRoomAction,
} from 'src/providers/PeerProvider/redux/actions';
import { GenericStateSlice } from 'src/redux/types';
import {
  switchRoomActivityAction,
  updateCurrentAnalysisAction,
  updateJoinedGameAction,
  updateJoinedWarGameAction,
  updateRelayGameAction,
  updateRoomActivityAction,
} from './actions';
import { BaseRoomActivity } from './types';

export type State = BaseRoomActivity;

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
      // If the activity is "Play"
      payload.room.activity.type === 'play' &&
      prev.type === 'play'
    ) {
      // But the Game Id has changed replace the old activity with the new
      if (payload.room.activity.gameId !== prev.game?.id) {
        return payload.room.activity;
      }

      // Update for the Offer and the Status
      return {
        ...payload.room.activity,
        game: prev.game,
      };
    }

    if (
      //If the activity is "WarGame"
      payload.room.activity.type === 'warGame' &&
      prev.type === 'warGame'
    ) {
      if (payload.room.activity.gameId !== prev.game?.id) {
        return payload.room.activity;
      }

      // Update for the Offer and the Status
      return {
        ...payload.room.activity,
        game: prev.game,
      };
    }

    if (
      // And the activity is "Analysis"
      payload.room.activity.type === 'analysis' &&
      prev.type === 'analysis' &&
      payload.room.activity.analysisId !== prev.analysis?.id
    ) {
      return payload.room.activity;
    }
    
    if (
      //and the activity is "Relay"
      payload.room.activity.type === 'relay' && 
      prev.type === 'relay' && 
      payload.room.activity.relayId !== prev.relayId
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

  handleAction(updateJoinedWarGameAction, (prev, {payload: nextGame}) => {
    if (prev.type !== 'warGame') {
      return prev;
    }

    return {
      ...prev,
      game: nextGame
    }
  }),

  handleAction(updateCurrentAnalysisAction, (prev, { payload: nextAnalysis }) => {
    if (prev.type !== 'analysis') {
      return prev;
    }

    return {
      ...prev,
      analysis: nextAnalysis,
    };
  }),

  handleAction(updateRelayGameAction, (prev, { payload: nextGame}) => {
    if (prev.type !== 'relay') {
      return prev;
    }

    return {
      ...prev,
      game: nextGame
    }
  })
]);

export const stateSliceByKey = {
  roomActivity: reducer,
};

export type ModuleState = ReturnType<typeof reducer>;
export type ModuleStateSlice = GenericStateSlice<typeof stateSliceByKey, typeof reducer>;
