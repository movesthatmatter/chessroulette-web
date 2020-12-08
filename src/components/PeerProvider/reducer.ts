import { createReducer } from 'deox';
import { joinedRoomUpdatedPayload, PeerRecord, RoomRecord } from 'dstnd-io';
import { GenericStateSlice } from 'src/redux/types';
import { Room, Peer } from '../RoomProvider';
import {
  createRoomAction,
  addPeerAction,
  addMyStream,
  addPeerStream,
  removePeerAction,
  updateRoomAction,
  remmoveMyStream,
  removeRoomAction,
  createMeAction,
  updateMeAction,
  removeMeAction,
} from './actions';

export type State = {
  me: undefined;
  room: undefined;
} | {
  me: Peer;
  room: undefined | Room;
}

export const initialState: State = {
  me: undefined,
  room: undefined,
};

const peerRecordToPeer = (p: PeerRecord): Peer => {
  return {
    ...p,
    connection: {
      // This shouldn't be so
      // there's no connetion with myself :)
      channels: {
        data: { on: true },
        streaming: { on: false },
      },
    },
  };
}

// const roomWithPeers = (room: RoomStatsRecord): Room =>

const getNewRoom = (me: Peer, room: RoomRecord): Room => {
  const { [me.id]: removedMyPeer, ...peersWithoutMe } = room.peers;

  const nextPeers = Object
    .values(peersWithoutMe)
    .map(peerRecordToPeer)
    .reduce((prev, next) => ({
      ...prev,
      [next.id]: next,
    }), {});

    const nextRoom: Room = {
      ...room,
      me,
      peers: nextPeers,
      peersIncludingMe: {
        ...nextPeers,
        [me.id]: me,
      },
      peersCount: Object.keys(nextPeers).length,
    }

    return nextRoom;
}

export const reducer = createReducer(initialState as State, (handleAction) => ([
  handleAction(createMeAction, (state, { payload }) => {
    const nextMe = peerRecordToPeer(payload.me);

    return {
      ...state,
      me: nextMe,
      ...payload.joinedRoom && {
        room: getNewRoom(nextMe, payload.joinedRoom),
      }
    }
  }),

  handleAction(updateMeAction, (state, { payload }) => {
    if (!state.me) {
      return state;
    }

    const nextMe: Peer = {
      ...state.me,
      ...payload.me,
    };

    const nextRoom: Room | undefined = (payload.me.hasJoinedRoom && state.room)
      // Only update Me if the state already has a room.
      // The iam room here shouldn't take precedence over a room update action
      ? {
        ...state.room,
        me: nextMe,
        peersIncludingMe: {
          ...state.room.peersIncludingMe,
          [nextMe.id]: nextMe,
        }
      }
      : (payload.joinedRoom && !state.room)
        ? getNewRoom(nextMe, payload.joinedRoom)
        : undefined;

    const next = {
      ...state,
      me: nextMe,
      room: nextRoom,
    }

    return next;
  }),

  handleAction(removeMeAction, () => {
    return {
      me: undefined,
      room: undefined,
    }
  }),

  // @Deprecate in favor of locally managing the local stream,
  //  since the PeerProvider dosn't need to care about it!
  handleAction(addMyStream, (state, { payload }) => {
    if (!state.me) {
      return state;
    }

    const nextMe: Peer = {
      ...state.me,
      connection: {
        ...state.me.connection,
        channels: {
          ...state.me.connection.channels,
          streaming: {
            on: true,
            stream: payload.stream,
            type: 'audio-video',
          },
        },
      },
    };

    return {
      ...state,
      me: nextMe,
      ...state.room && {
        room: {
          ...state.room,
          me: nextMe,
          peersIncludingMe: {
            ...state.room.peersIncludingMe,
            [nextMe.id]: nextMe,
          },
        },
      },
    };
  }),

  // @deprecate – see above!
  handleAction(remmoveMyStream, (state) => {
    if (!state.me) {
      return state;
    }

    const nextMe: Peer = {
      ...state.me,
      connection: {
        ...state.me.connection,
        channels: {
          ...state.me.connection.channels,
          streaming: { on: false },
        },
      },
    };

    return {
      ...state,
      me: nextMe,
      ...state.room && {
        room: {
          ...state.room,
          me: nextMe,
          peersIncludingMe: {
            ...state.room.peersIncludingMe,
            [nextMe.id]: nextMe,
          },
        },
      }
    };
  }),

  handleAction(createRoomAction, (state, { payload }) => {
    if (!state.me) {
      return state;
    }

    const nextMe = {
      ...state.me,
      ...payload.me,
    };

    return {
      ...state,
      me: nextMe,
      room: getNewRoom(nextMe, payload.room),
    };
  }),
  handleAction(updateRoomAction, (state, { payload }) => {
    if (!state.room) {
      return state;
    }

    const {
      [state.me.id]: removedMyPeer,
      ...peersWithoutMe
    } = payload.room.peers;

    const nextPeers = Object
      .values(peersWithoutMe)
      .map((peer) => {
        // If already present use it
        if (state.room?.peers[peer.id]) {
          return state.room?.peers[peer.id];
        }

        // Otherwise add the new one
        return peerRecordToPeer(peer);
      })
      .reduce((prev, next) => ({
        ...prev,
        [next.id]: next,
      }), {});

    const nextRoom: Room = {
      ...state.room,
      ...payload.room,
      me: state.me,
      peers: nextPeers,
      peersCount: Object.keys(nextPeers).length,
      peersIncludingMe: {
        [state.me.id]: state.me,
        ...nextPeers,
      },
    };

    return {
      ...state,
      room: nextRoom,
    };
  }),

  handleAction(removeRoomAction, (state) => {
    return {
      ...state,
      room: undefined,
    }
  }),

  handleAction(addPeerAction, (state, { payload }) => {
    if (!state.room) {
      return state;
    }

    const nextPeers = {
      ...state.room.peers,
      [payload.id]: peerRecordToPeer(payload),
    } as const;

    return {
      ...state,
      room: {
        ...state.room,
        peers: nextPeers,
        peersCount: Object.keys(nextPeers).length,
        peersIncludingMe: {
          [state.room.me.id]: state.room.me,
          ...nextPeers,
        },
      },
    };
  }),
  handleAction(removePeerAction, (state, { payload }) => {
    if (!state.room) {
      return state;
    }

    const { [payload.peerId]: removed, ...restPeers } = state.room.peers;

    return {
      ...state,
      room: {
        ...state.room,
        peers: restPeers,
        peersIncludingMe: {
          [state.room.me.id]: state.room.me,
          ...restPeers,
        },
      },
    };
  }),

  handleAction(addPeerStream, (state, { payload }) => {
    if (!state.room) {
      return state;
    }

    if (!state.room.peers[payload.peerId]) {
      return state;
    }

    const nextPeer: Peer = {
      ...state.room.peers[payload.peerId],
      connection: {
        ...state.room.peers[payload.peerId].connection,
        channels: {
          ...state.room.peers[payload.peerId].connection.channels,
          streaming: {
            on: true,
            stream: payload.stream,
            type: 'audio-video',
          },
        },
      },
    };

    return {
      ...state,
      room: {
        ...state.room,
        peers: {
          ...state.room.peers,
          [payload.peerId]: nextPeer,
        },
        peersIncludingMe: {
          ...state.room.peersIncludingMe,
          [payload.peerId]: nextPeer,
        }
      },
    };
  }),
]));

export const stateSliceByKey = {
  peerProvider: reducer,
};

export type ModuleState = ReturnType<typeof reducer>;
export type ModuleStateSlice = GenericStateSlice<
  typeof stateSliceByKey,
  typeof reducer
>;
