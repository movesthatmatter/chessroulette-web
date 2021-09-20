import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { notificationFactory } from './utils/notificationFactory';
import { useStateWithPrev } from 'src/lib/hooks/useStateWithPrev';
import useDebouncedEffect from 'use-debounced-effect';
import {
  addNotificationAction,
  clearLogAction,
  resolveOfferNotificationAction,
} from '../redux/actions';
import { JoinedRoom } from 'src/modules/Room/types';

// This could depend on the room ID as well
export const useRoomActivityListener = (room: JoinedRoom | undefined) => {
  const dispatch = useDispatch();

  const game = room?.currentActivity.type === 'play' ? room?.currentActivity.game : undefined;
  const offer = room?.currentActivity.type === 'play' ? room?.currentActivity.offer : undefined;
  const pendingRoomChallenge = room?.pendingChallenges
    ? Object.values(room.pendingChallenges)[0]
    : undefined;
  const [stateWithPrev, setStateWithPrev] = useStateWithPrev({ game, offer, pendingRoomChallenge });

  useDebouncedEffect(
    () => {
      // if (game) {
      setStateWithPrev({ game, offer, pendingRoomChallenge });
      // }
    },
    150, // This should be enough time for the game & offer to reconcile
    [game, offer, pendingRoomChallenge]
  );

  useEffect(() => {
    const nextNotification = notificationFactory(stateWithPrev);

    if (!nextNotification) {
      return;
    }

    if (nextNotification.type === 'add') {
      dispatch(addNotificationAction({ notification: nextNotification.notification }));
    } else if (nextNotification.type === 'update' && nextNotification.status !== 'pending') {
      dispatch(
        resolveOfferNotificationAction({
          notificationId: nextNotification.id,
          status: nextNotification.status,
        })
      );
    }
  }, [stateWithPrev]);

  useEffect(() => {
    return () => {
      // Clear the Logs when the Listener gets unmounted
      //  This should mean exiting the Room
      dispatch(clearLogAction());
    };
  }, []);
};
