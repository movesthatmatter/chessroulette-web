import { createAction, createReducer } from 'deox';
import { StreamingPeer, StreamingPeersMap } from '../../types';

type State =
  | {
      ready: false;
    }
  | {
      ready: true;
      streamersMap: StreamingPeersMap;
      inFocus: StreamingPeer;
      reel: StreamingPeer[];
      reelByUserId: Record<StreamingPeer['user']['id'], number>;
    };

const getStreamerOrFallback = (
  streamersMap: StreamingPeersMap,
  userId?: string,
  fallbackUserId?: string
): StreamingPeer => {
  if (Object.keys(streamersMap).length === 0) {
    throw new Error('MultiStreamingBox Empty Peer Streaming Config Map Error');
  }

  return userId && userId in streamersMap
    ? streamersMap[userId]
    : getStreamerOrFallback(streamersMap, fallbackUserId, Object.keys(streamersMap)[0]);
};

export const initialState: State = {
  ready: false,
};

export const initAction = createAction(
  'Init',
  (resolve) => (p: {
    streamersMap: StreamingPeersMap;
    focusedUserId?: StreamingPeer['user']['id'];
  }) => resolve(p)
);

export const focusAction = createAction(
  'Focus',
  (resolve) => (p: { userId: StreamingPeer['user']['id'] }) => resolve(p)
);

export const updateAction = createAction(
  'Update',
  (resolve) => (p: { streamersMap: StreamingPeersMap }) => resolve(p)
);

export const reducer = createReducer(initialState as State, (handleAction) => [
  handleAction([initAction, updateAction], (state, action) => {
    // Exit early if there are no streamers
    if (Object.keys(action.payload.streamersMap).length === 0) {
      return {
        ready: false,
      };
    }

    const nextFocusOn =
      action.type === 'Init'
        ? action.payload.focusedUserId
        : state.ready
        ? state.inFocus.user.id
        : undefined;

    const inFocus = getStreamerOrFallback(action.payload.streamersMap, nextFocusOn);

    const { payload } = action;

    const reel = Object.values(payload.streamersMap)
      .filter((p) => p.user.id !== inFocus.user.id)
      .reduce((prev, next) => [...prev, next], [] as StreamingPeer[]);

    return {
      ...state,
      ready: true,
      streamersMap: payload.streamersMap,
      inFocus,
      reel,
      reelByUserId: reel.reduce(
        (prev, next, index) => ({
          ...prev,
          [next.user.id]: index,
        }),
        {}
      ),
    };
  }),
  handleAction(focusAction, (prev, { payload }) => {
    if (!prev.ready) {
      return prev;
    }

    const nextFocused = getStreamerOrFallback(
      prev.streamersMap,
      payload.userId,
      prev.inFocus.user.id
    );

    // If the next focused is the same as the prev don't change anything
    if (nextFocused.user.id === prev.inFocus.user.id) {
      return prev;
    }

    const currentSlotIndex = prev.reelByUserId[payload.userId];
    const nextReel = [
      ...prev.reel.slice(0, currentSlotIndex),
      prev.inFocus,
      ...prev.reel.slice(currentSlotIndex + 1),
    ];
    const {
      [nextFocused.user.id]: removed,
      ...prevReelByUserIdMapWithoutNextFocused
    } = prev.reelByUserId;

    return {
      ...prev,
      inFocus: nextFocused,
      reel: nextReel,
      reelByUserId: {
        ...prevReelByUserIdMapWithoutNextFocused,
        [prev.inFocus.user.id]: currentSlotIndex,
      },
    };
  }),
]);
