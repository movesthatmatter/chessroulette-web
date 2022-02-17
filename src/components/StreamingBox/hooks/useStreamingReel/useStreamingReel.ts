import { UserRecord } from 'dstnd-io';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { Room } from 'src/providers/PeerProvider';
import { reducer, initialState, initAction, focusAction, updateAction } from './reducer';
import { Streamer } from './types';

type Props = {
  peers: Room['peers'];
  focusedUserId?: Streamer['user']['id'];
};

export const useStreamingReel = ({ peers, focusedUserId }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const streamersMap = useMemo(() => {
    return Object.values(peers).reduce((prev, next) => {
      if (!next.connection.channels.streaming.on) {
        return prev;
      }

      return {
        ...prev,
        [next.id]: {
          user: next.user,
          streamingConfig: next.connection.channels.streaming,
        },
      };
    }, {});
  }, [peers]);

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
