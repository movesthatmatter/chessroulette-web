import { createAction, createReducer } from 'deox';
import { PeerRecord, RoomStatsRecord } from 'dstnd-io';
import { Room, Peer } from '../RoomProvider';

export const createRoomAction = createAction(
  'Create Room',
  (resolve) => (p: {
    room: RoomStatsRecord;
    me: PeerRecord;
  }) => resolve(p),
);

export const addPeerAction = createAction(
  'Add Peer',
  (resolve) => (p: PeerRecord) => resolve(p),
);

export const removePeerAction = createAction(
  'Remove Peer',
  (resolve) => (p: {peerId: PeerRecord['id']}) => resolve(p),
);

export const addMyStream = createAction(
  'Add My Stream',
  (resolve) => (p: {
    stream: MediaStream;
  }) => resolve(p),
);

export const addPeerStream = createAction(
  'Add Peer Stream',
  (resolve) => (p: {
    peerId: string;
    stream: MediaStream;
  }) => resolve(p),
);

type State = {
  room: undefined | Room;
}

export const initialState: State = {
  room: undefined,
};

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

  handleAction(addPeerAction, (state, { payload }) => {
    if (!state.room) {
      return state;
    }

    const nextPeers = {
      ...state.room?.peers ?? {},
      [payload.id]: {
        id: payload.id,
        user: {
          name: payload.user.name,
          id: payload.user.name,
          avatarId: payload.id.slice(-1)[0],
        },
        // This should be in user
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
