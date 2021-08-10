import { combineReducers } from 'redux';
import { stateSliceByKey as authentication } from 'src/services/Authentication';
import { stateSliceByKey as peerProvider } from 'src/providers/PeerProvider/redux/reducer';
import { stateSliceByKey as session } from 'src/services/Session/reducer';

// All of these 3 could be under a "room" slice and part of the Room(s) module
// import { stateSliceByKey as roomBouncer } from 'src/modules/Rooms/GenericRoom/GenericRoomBouncer/reducer';
import { stateSliceByKey as activityLog } from 'src/modules/Room/ActivityLog/redux/reducer';
import { stateSliceByKey as roomBouncer } from 'src/modules/RoomV3/RoomBouncer/redux/reducer';

import { stateSliceByKey as room } from 'src/modules/RoomV3/redux/reducer';

const allModuleReducers = {
  ...authentication,
  ...peerProvider,
  ...session,

  // All of these 3 could be under a "room" slice
  ...roomBouncer,
  ...activityLog,

  ...room,
};

export const rootReducer = combineReducers({
  ...allModuleReducers,
});

export type RootState = ReturnType<typeof rootReducer>;
