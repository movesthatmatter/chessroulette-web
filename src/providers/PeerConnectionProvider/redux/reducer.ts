import { createReducer } from 'deox';
import { Peer } from 'src/providers/PeerProvider';
import { GenericStateSlice } from 'src/redux/types';
import { createPeerConnectionAction, updatePeerConnectionAction, removePeerConnectionAction } from './actions';

export type State = Peer | null;

export const initialState: State = null;

export const reducer = createReducer(initialState as State, (handleAction) => [
  handleAction([createPeerConnectionAction, updatePeerConnectionAction], (_, { payload: peer }) => ({
    ...peer,
    isMe: true,
    userId: peer.user.id,

    // Should there be connection for my peer?
    connection: {
      // This shouldn't be so
      // there's no connetion with myself :)
      channels: {
        data: { on: true },
        streaming: { on: false },
      },
    },
  })),
  handleAction(removePeerConnectionAction, () => null),
]);

export const stateSliceByKey = {
  peer: reducer,
};

export type ModuleState = ReturnType<typeof reducer>;
export type ModuleStateSlice = GenericStateSlice<typeof stateSliceByKey, typeof reducer>;
