import { UserRecord } from 'dstnd-io';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { isStreamingPeer, PeersMap, StreamingPeer, StreamingPeersMap } from '../../types';
import { reducer, initialState, initAction, focusAction, updateAction } from './reducer';

type Props = {
  peersMap: PeersMap;
  focusedUserId?: StreamingPeer['id'];
};

export const useStreamingPeers = ({ peersMap, focusedUserId }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const streamersMap = useMemo(() => {
    return Object.values(peersMap).reduce((prev, next) => {
      if (!isStreamingPeer(next)) {
        return prev;
      }

      return {
        ...prev,
        [next.id]: next,
      };
    }, {} as StreamingPeersMap);
  }, [peersMap]);

  useEffect(() => {
    dispatch(
      initAction({
        streamersMap,
        focusedUserId,
      })
    );
  }, [streamersMap, focusedUserId]);

  useEffect(() => {
    dispatch(updateAction({ streamersMap }));
  }, [streamersMap]);

  useEffect(() => {
    if (focusedUserId) {
      dispatch(focusAction({ userId: focusedUserId }));
    }
  }, [focusedUserId]);

  const onFocus = useCallback(
    (userId: UserRecord['id']) => {
      if (state.ready) {
        dispatch(focusAction({ userId }));
      }
    },
    [state.ready]
  );

  return { state, onFocus };
};
