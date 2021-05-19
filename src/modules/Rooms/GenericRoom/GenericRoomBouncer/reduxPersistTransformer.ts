import { createTransform } from 'redux-persist';
import { initialState, ModuleState } from './reducer';

export const setGenericRoomBouncerPersistTransform = createTransform(
  // transform state on its way to being serialized and persisted.
  (inboundState: NonNullable<ModuleState>, key) => {
    // Remove the permissionsGranted
    const { permissionsGranted, ready, ...persistableInboundState } = inboundState || {};

    return persistableInboundState;
  },
  // transform state being rehydrated
  (outboundState: Omit<NonNullable<ModuleState>, 'permissionsGranted' | 'ready'>, key) => {
    // convert mySet back to a Set.
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
