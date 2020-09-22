import { createAction, createReducer } from 'deox';
import { PeerRecord, RoomStatsRecord } from 'dstnd-io';
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
} from './actions';

type State = {
  room: undefined | Room;
}

export const initialState: State = {
  room: undefined,
};

// const roomWithPeers = (room: RoomStatsRecord): Room =>

export const reducer = createReducer(initialState, (handleAction) => ([
  // handleAction(createRoomAction, (state) => state),
  handleAction(createRoomAction, (state, { payload }) => {
    const nextMe = {
      ...payload.me,
      user: {
        ...payload.me.user,
        avatarId: payload.me.id.slice(-1)[0],
      },
      connection: {
        // This shouldn't be so
        // there's no connetion with myself :)
        channels: {
          data: { on: true },
          streaming: { on: false },
        },
      },
    } as const;

    const nextPeers = state.room?.peers ?? {};

    return {
      ...state,
      room: {
        ...payload.room,
        me: nextMe,
        peers: nextPeers,
        peersIncludingMe: {
          ...state.room?.peersIncludingMe,
          [payload.me.id]: nextMe,
        },
        peersCount: Object.keys(nextPeers).length,
      },
    };
  }),
  handleAction(updateRoomAction, (state, { payload }) => {
    if (!state.room) {
      return state;
    }

    const nextPeers = Object
      .keys(payload.room.peers)
      .filter((peerId) => state.room?.me.id !== peerId) // Takes me out
      .reduce((res, nextPeerId) => {
        // Create new peer if not existent
        if (!state.room?.peers[nextPeerId]) {
          return {
            ...res,
            [nextPeerId]: {
              ...payload.room.peers[nextPeerId],

              // Simply add the connection
              connection: {
                channels: {
                  // These could be passed in the action
                  data: { on: true },
                  streaming: { on: false },
                },
              },
            } as const,
          };
        }

        // Otherwise merge them - this also removes lingering peers
        return {
          ...res,
          [nextPeerId]: {
            ...state.room.peers[nextPeerId],
            ...state.room?.peers[nextPeerId],
          },
        };
      }, {} as Room['peers']);

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

  handleAction(addPeerAction, (state, { payload }) => {
    if (!state.room) {
      return state;
    }

    const nextPeers = {
      ...state.room?.peers ?? {},
      [payload.id]: {
        ...payload,
        connection: {
          channels: {
            // These could be passed in the action
            data: { on: true },
            streaming: { on: false },
          },
        },
      },
    } as const;

    return {
      ...state,
      room: {
        ...state.room,
        peers: nextPeers,
        peersCount: Object.keys(nextPeers).length,
        peersIncludingMe: {
          ...state.room?.peersIncludingMe ?? {},
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
          ...restPeers,
          [state.room.me.id]: state.room.me,
        },
      },
    };
  }),

  handleAction(addMyStream, (state, { payload }) => {
    if (!state.room) {
      return state;
    }

    const nextMe: Peer = {
      ...state.room.me,
      connection: {
        ...state.room.me.connection,
        channels: {
          ...state.room.me.connection.channels,
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
        me: nextMe,
        peersIncludingMe: {
          ...state.room.peersIncludingMe,
          [nextMe.id]: nextMe,
        },
      },
    };
  }),
  handleAction(remmoveMyStream, (state) => {
    if (!state.room) {
      return state;
    }

    const nextMe: Peer = {
      ...state.room?.me,
      connection: {
        ...state.room.me.connection,
        channels: {
          ...state.room.me.connection.channels,
          streaming: { on: false },
        },
      },
    };

    return {
      ...state,
      room: {
        ...state.room,
        me: nextMe,
        peersIncludingMe: {
          ...state.room.peersIncludingMe,
          [nextMe.id]: nextMe,
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

    return {
      ...state,
      room: {
        ...state.room,
        peers: {
          ...state.room.peers,
          [payload.peerId]: {
            ...state.room.peers[payload.peerId],
            connection: {
              channels: {
                ...state.room.peers[payload.peerId].connection.channels,
                streaming: {
                  on: true,
                  stream: payload.stream,
                  type: 'audio-video',
                },
              },
            },
          },
        },
      },
    };
  }),
]));

export const stateSliceByKey = {
  joinedRoom: reducer,
};

export type ModuleState = ReturnType<typeof reducer>;
export type ModuleStateSlice = GenericStateSlice<
  typeof stateSliceByKey,
  typeof reducer
>;
