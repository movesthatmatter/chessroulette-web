import { createTransform } from 'redux-persist';
import { initialState, ModuleState } from './reducer';

export const setGenericRoomBouncerPersistTransform = createTransform(
  // transform state on its way to being serialized and persisted.
  (inboundState: NonNullable<ModuleState>, key) => {
    // Remove the permissionsGranted
    const {
      permissionsGranted,
      ready,
      // Remove the browserIsUnsupported so the checkBrowser happens each time
      browserIsUnsupported,
      ...persistableInboundState
    } = inboundState || {};

    return {
      ...persistableInboundState,
      browserIsUnsupported: undefined,
    };
  },
  // transform state being rehydrated
  (outboundState: Omit<NonNullable<ModuleState>, 'permissionsGranted' | 'ready'>, key) => {
    // convert back
    return {
      ...initialState,
      ...outboundState,
      permissionsGranted: undefined,
      ready: false,
    };
  },
  // define which reducers this transform gets called for.
  { whitelist: ['roomBouncer'] }
);
