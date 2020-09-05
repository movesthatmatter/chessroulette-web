import { combineReducers } from 'redux';
import { stateSliceByKey as authentication } from 'src/services/Authentication';
import { stateSliceByKey as chessStudy } from 'src/modules/ChessStudy/reducer';
import { stateSliceByKey as joinedRoom } from 'src/components/PeerProvider/reducer';

const allModuleReducers = {
  ...authentication,
  ...chessStudy,
  ...joinedRoom,
};

export const rootReducer = combineReducers({
  ...allModuleReducers,
});

export type RootState = ReturnType<typeof rootReducer>;
