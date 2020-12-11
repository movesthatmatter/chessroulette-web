import { combineReducers } from 'redux';
import { stateSliceByKey as authentication } from 'src/services/Authentication';
import { stateSliceByKey as chessStudy } from 'src/modules/ChessStudy/reducer';
import { stateSliceByKey as joinedRoom } from 'src/components/PeerProvider/redux/reducer';
import { stateSliceByKey as roomBouncer } from 'src/modules/GenericRoom/GenericRoomBouncer/reducer';

const allModuleReducers = {
  ...authentication,
  ...chessStudy,
  ...joinedRoom,

  // This should be saved in the session at least, for the camera agreed
  //  and other consents!
  ...roomBouncer,
};

export const rootReducer = combineReducers({
  ...allModuleReducers,
});

export type RootState = ReturnType<typeof rootReducer>;
