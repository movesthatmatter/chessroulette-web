import { createReducer } from "deox"
import { persistReducer } from "redux-persist";
import { GenericStateSlice } from "src/redux/types";
import storage from 'redux-persist/lib/storage';
import {switchThemeAction} from './actions';
import { CustomTheme } from "..";

export type ThemeState = {
  theme: CustomTheme['name']
}

const defaultState: ThemeState = {
  theme: 'lightDefault'
}

export const reducer = createReducer(defaultState as ThemeState, (handleAction) => [
  handleAction(switchThemeAction, (prev) => {
    return {
      theme: prev.theme === 'darkDefault' ? 'lightDefault' : 'darkDefault'
    }
  })
])

export const stateSliceByKeyWithoutPersist = {
  theme: reducer
}

export const stateSliceByKey = {
  theme: persistReducer({
    key: 'theme',
    storage
  }, reducer)
}

export type ModuleState = ReturnType<typeof reducer>;
export type ModuleStateSlice = GenericStateSlice<typeof stateSliceByKeyWithoutPersist, typeof reducer>;