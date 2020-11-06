import { createReducer } from 'deox';
import { PeerRecord } from 'dstnd-io';
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

type State = {
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

export const reducer = createReducer(initialState as State, (handleAction) => ([
  handleAction(createMeAction, (state, { payload }) => {
    return {
      ...state,
      me: peerRecordToPeer(payload),
    }
  }),

  handleAction(updateMeAction, (state, { payload }) => {
    if (!state.me) {
      return state;
    }

    const nextMe = {
      ...state.me,
      ...payload,
    };

    const nextRoom = (nextMe.hasJoinedRoom && state.room)
      ? {
        ...state.room,
        me: nextMe,
        peersIncludingMe: {
          ...state.room.peersIncludingMe,
          [nextMe.id]: nextMe,
        }
      }
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

    const {
      [state.me.id]: removedMyPeer,
      ...peersWithoutMe
    } = payload.room.peers;

    const nextPeers = Object
      .values(peersWithoutMe)
      .map(peerRecordToPeer)
      .reduce((prev, next) => ({
        ...prev,
        [next.id]: next,
      }), {});

    const nextMe = {
      ...state.me,
      ...payload.me,
    };

    const nextRoom: Room = {
      ...payload.room,
      me: nextMe,
      peers: nextPeers,
      peersIncludingMe: {
        ...nextPeers,
        [payload.me.id]: nextMe,
      },
      peersCount: Object.keys(nextPeers).length,
    }

    return {
      ...state,
      me: nextMe,
      room: nextRoom,
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

    return {
      ...state,
      room: {
        ...state.room,
        ...payload.room,
        peers: nextPeers,
        peersCount: Object.keys(nextPeers).length,
        peersIncludingMe: {
          [state.room.me.id]: state.room.me,
          ...nextPeers,
        },
      },
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
