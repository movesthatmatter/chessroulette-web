import { createReducer } from "deox"
import { persistReducer } from "redux-persist";
import { GenericStateSlice } from "src/redux/types";
import storageSession from 'redux-persist/lib/storage/session';
import {switchThemeAction} from './actions';

export type ThemeState = {
  theme: 'light' | 'dark';
}

const defaultState: ThemeState = {
  theme: 'light'
}

export const reducer = createReducer(defaultState as ThemeState, (handleAction) => [
  handleAction(switchThemeAction, (prev) => {
    console.log('yes reducer!!');
    return {
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }
  })
])

export const stateSliceByKeyWithoutPersist = {
  theme: reducer
}

export const stateSliceByKey = {
  theme: persistReducer({
    key: 'theme',
    storage: storageSession
  }, reducer)
}

export type ModuleState = ReturnType<typeof reducer>;
export type ModuleStateSlice = GenericStateSlice<typeof stateSliceByKeyWithoutPersist, typeof reducer>;