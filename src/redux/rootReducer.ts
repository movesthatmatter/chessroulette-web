import { combineReducers } from 'redux';
import { stateSliceByKey as authentication } from 'src/services/Authentication';
import { stateSliceByKey as joinedRoom } from 'src/components/PeerProvider/redux/reducer';
import { stateSliceByKey as roomBouncer } from 'src/modules/Rooms/GenericRoom/GenericRoomBouncer/reducer';
import { stateSliceByKey as session } from 'src/services/Session/reducer';

const allModuleReducers = {
  ...authentication,
  ...joinedRoom,
  ...session,

  // This should be saved in the session at least, for the camera agreed
  //  and other consents!
  ...roomBouncer,
};

export const rootReducer = combineReducers({
  ...allModuleReducers,
});

export type RootState = ReturnType<typeof rootReducer>;
