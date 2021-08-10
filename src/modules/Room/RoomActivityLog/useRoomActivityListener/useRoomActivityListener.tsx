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
// import { JoinedRoom } from '../../types';

// This could depend on the room ID as well
export const useRoomActivityListener = (room: JoinedRoom | undefined) => {
  const dispatch = useDispatch();

  const offer = room?.currentActivity.type === 'play' ? room?.currentActivity.offer : undefined;
  const game = room?.currentActivity.type === 'play' ? room?.currentActivity.game : undefined;

  const [gameAndOfferZipWithPrev, setGameAndOfferZipWithPrev] = useStateWithPrev({ game, offer });

  useDebouncedEffect(
    () => {
      if (game) {
        setGameAndOfferZipWithPrev({ game, offer });
      }
    },
    150, // This should be enough time for the game & offer to reconcile
    [game, offer]
  );

  useEffect(() => {
    const nextNotification = notificationFactory(gameAndOfferZipWithPrev);
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
  }, [gameAndOfferZipWithPrev]);

  useEffect(() => {
    return () => {
      // Clear the Logs when the Listener gets unmounted
      //  This should mean exiting the Room
      dispatch(clearLogAction());
    };
  }, []);
};
