import { ModuleStateSlice } from "src/services/Session/reducer";

export const selectMediaStatus = (state: ModuleStateSlice) => state.session.mediaStatus;