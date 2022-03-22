import { createAction } from 'deox';
import { PeerRecord } from 'dstnd-io';

export const createPeerConnectionAction = createAction('Create Peer Connection', (resolve) => (p: PeerRecord) => resolve(p));
export const updatePeerConnectionAction = createAction('Update Peer Connection', (resolve) => (p: PeerRecord) => resolve(p));
export const removePeerConnectionAction = createAction('Remove Peer Connection', (resolve) => () => resolve());
