import { createReducer } from 'deox';
import { PeerRecord } from 'chessroulette-io';
import { GenericStateSlice } from 'src/redux/types';
import { Peer } from '../types';
import {
  createPeerConnectionAction,
  updatePeerConnectionAction,
  removePeerConnectionAction,
} from './actions';

export type State = Peer | null;

export const initialState: State = null;

const toInitialMyPeer = (peerRecord: PeerRecord): Peer => ({
  ...peerRecord,
  isMe: true,
  userId: peerRecord.user.id,

  // Should there be connection for my peer?
  connection: {
    // This shouldn't be so
    // there's no connetion with myself :)
    channels: {
      data: { on: true },
      streaming: { on: false },
    },
  },
});

export const reducer = createReducer(initialState as State, (handleAction) => [
  handleAction([createPeerConnectionAction, updatePeerConnectionAction], (_, { payload }) =>
    toInitialMyPeer(payload)
  ),
  handleAction(removePeerConnectionAction, () => null),
]);

export const stateSliceByKey = {
  peer: reducer,
};

export type ModuleState = ReturnType<typeof reducer>;
export type ModuleStateSlice = GenericStateSlice<typeof stateSliceByKey, typeof reducer>;
