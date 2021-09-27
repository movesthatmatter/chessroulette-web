import { RootState } from "src/redux/rootReducer";
import { ModuleState, ModuleStateSlice } from "./reducer";

export const selectTheme = (state:RootState) => state.theme.theme