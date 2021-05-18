import { combineReducers } from 'redux';
import { stateSliceByKey as authentication } from 'src/services/Authentication';
import { stateSliceByKey as peerProvider } from 'src/providers/PeerProvider/redux/reducer';
import { stateSliceByKey as roomBouncer } from 'src/modules/Rooms/GenericRoom/GenericRoomBouncer/reducer';
import { stateSliceByKey as activityLog } from 'src/modules/ActivityLog/redux/reducer';
import { stateSliceByKey as session } from 'src/services/Session/reducer';

const allModuleReducers = {
  ...authentication,
  ...peerProvider,
  ...session,
  ...roomBouncer,
  ...activityLog,
};

export const rootReducer = combineReducers({
  ...allModuleReducers,
});

export type RootState = ReturnType<typeof rootReducer>;
