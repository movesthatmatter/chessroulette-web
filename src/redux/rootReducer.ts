import { combineReducers } from 'redux';
import { stateSliceByKey as authentication } from 'src/services/Authentication';
// import { stateSliceByKey as peerProvider } from 'src/providers/PeerProvider/redux/reducer';
import { stateSliceByKey as feedbackProvider } from 'src/providers/FeedbackProvider/redux/reducer';
import { stateSliceByKey as peerConnectionProvider} from 'src/providers/PeerConnectionProvider/redux/reducer';
import { stateSliceByKey as session } from 'src/services/Session/reducer';
import { stateSliceByKey as room } from 'src/modules/Room/redux/reducer';
import { stateSliceByKey as theme} from 'src/theme/redux/reducer';

const allModuleReducers = {
  ...authentication,
  // ...peerProvider,
  ...feedbackProvider,
  ...session,
  ...room,
  ...theme,
  ...peerConnectionProvider,
};

export const rootReducer = combineReducers({
  ...allModuleReducers,
});

export type RootState = ReturnType<typeof rootReducer>;
