import { createReducer } from 'deox';
import { PeerRecord, room, RoomRecord } from 'dstnd-io';
import { combineReducers } from 'redux';
import { Peer } from 'src/providers/PeerConnectionProvider';
import { GenericStateSlice } from 'src/redux/types';
import { roomMatchActivityToPlayActivityRecord } from '../RoomActivity/activities/MatchActivity';
import { stateSliceByKey as activity } from '../RoomActivity/redux/reducer';
import { stateSliceByKey as activityLog } from '../RoomActivityLog/redux/reducer';
import { Room } from '../types';
import {
  createRoomAction,
  removeRoomAction,
  updateRoomAction,
  updateRoomPeerConnectionChannels,
} from './actions';

type State = Room | null;

export const initialState: State = null;

const peerRecordToPeer = ({ peer, isMe }: { peer: PeerRecord; isMe: boolean }): Peer => {
  return {
    ...peer,
    isMe,
    userId: peer.user.id,
    connection: {
      // This shouldn't be so
      // there's no connetion with myself :)
      channels: {
        data: { on: true },
        streaming: { on: false },
      },
    },
  };
};

const getNewRoom = (me: Peer, room: RoomRecord): Room => {
  const { [me.id]: removedMyPeer, ...peersWithoutMe } = room.peers;

  const nextPeers = Object.values(peersWithoutMe)
    .map((peer) => peerRecordToPeer({ peer, isMe: false }))
    .reduce(
      (prev, next) => ({
        ...prev,
        [next.id]: next,
      }),
      {}
    );

  const nextRoom: Room = {
    ...room,
    me,
    peers: nextPeers,
    peersIncludingMe: {
      ...nextPeers,
      [me.id]: me,
    },
    peersCount: Object.keys(nextPeers).length,
  };

  return nextRoom;
};

// TODO: This is only temporary, until the "match" activity is fully supported on the client
const ensureMatchIsConvertedToPlayRoom = (room: Room): Room => ({
  ...room,
  ...(room.activity.type === 'match' && {
    activity: roomMatchActivityToPlayActivityRecord(room.activity),
  }),
});

const reducer = createReducer(initialState as State, (handleAction) => [
  handleAction(createRoomAction, (_, { payload }) => ensureMatchIsConvertedToPlayRoom(getNewRoom(payload.me, payload.room))),
  handleAction(updateRoomAction, (state, { payload }) => {
    if (!state) {
      return state;
    }

    const { [state.me.id]: removedMyPeer, ...peersWithoutMe } = payload.room.peers;

    const nextPeers = Object.values(peersWithoutMe)
      .map((peer) => {
        // If already present use it
        if (state.peers[peer.id]) {
          return state.peers[peer.id];
        }

        // Otherwise add the new one
        return peerRecordToPeer({ peer, isMe: false });
      })
      .reduce(
        (prev, next) => ({
          ...prev,
          [next.id]: next,
        }),
        {}
      );

    const nextRoom: Room = {
      ...state,
      ...payload.room,
      me: state.me,
      peers: nextPeers,
      peersCount: Object.keys(nextPeers).length,
      peersIncludingMe: {
        [state.me.id]: state.me,
        ...nextPeers,
      },
    };

    return ensureMatchIsConvertedToPlayRoom(nextRoom);
  }),

  handleAction(removeRoomAction, () => null),
  handleAction(updateRoomPeerConnectionChannels, (state, { payload }) => {
    if (!state) {
      return null;
    }

    const nextPeer: Peer = {
      ...state.peers[payload.peerId],
      connection: {
        ...state.peers[payload.peerId].connection,
        channels: {
          ...state.peers[payload.peerId].connection.channels,
          ...payload.channels,
        },
      },
    };

    return {
      ...state,
      peers: {
        ...state.peers,
        [payload.peerId]: nextPeer,
      },

      // TODO: Do we still need this?
      peersIncludingMe: {
        ...state.peersIncludingMe,
        [payload.peerId]: nextPeer,
      },
    };
  }),
]);

const combinedReducer = combineReducers({
  roomInfo: reducer,
  ...activity,
  ...activityLog,
});

export const stateSliceByKey = {
  room: combinedReducer,
};

export type ModuleState = ReturnType<typeof combinedReducer>;
export type ModuleStateSlice = GenericStateSlice<typeof stateSliceByKey, typeof combinedReducer>;
