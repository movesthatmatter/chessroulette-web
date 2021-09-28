import { createReducer } from "deox"
import { GenericStateSlice } from "src/redux/types";
import { AVStreamingConstraints } from "src/services/AVStreaming";
import { initAudioVideoContraints, updateAVConstraints } from "./actions"

const initialState: AVStreamingConstraints = {
  video: true,
  audio: true,
}

export const reducer = createReducer(initialState, (handleAction) => [
  handleAction(initAudioVideoContraints, (state, {payload}) => {
    return {
      ...state,
      video: payload.video,
      audio: payload.audio,
    }
  }),
  handleAction(updateAVConstraints, (state, {payload}) => {
    return {
      ...state,
      video: payload.video,
      audio: payload.audio
    }
  })
]);

export const stateSliceByKey = {
  mediaStatus: reducer
};

export type ModuleState = ReturnType<typeof reducer>;
export type ModuleStateSlice = GenericStateSlice<typeof stateSliceByKey, typeof reducer>;
