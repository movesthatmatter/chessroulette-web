import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { Game } from 'src/modules/Games';
import { notificationFactory } from './utils/notificationFactory';
import { useStateWithPrev } from 'src/lib/hooks/useStateWithPrev';
import useDebouncedEffect from 'use-debounced-effect';
import { addNotificationAction, clearLogAction, resolveOfferNotificationAction } from '../redux/actions';
// import { RoomActivity } from 'src/modules/RoomActivity/redux/types';
// import { selectRoomActivity } from 'src/providers/PeerProvider';
import { selectCurrentRoomActivity } from 'src/modules/Room/Activities/redux/selectors';
import { JoinedRoom } from '../../types';

// This could depend on the room ID as well
//  So it removes when the room gets removed
export const useRoomActivityListener = ({ currentActivity }: JoinedRoom) => {
  const dispatch = useDispatch();
  // const roomActivity = useSelector(selectCurrentRoomActivity);

  const offer = currentActivity.type === 'play' ? currentActivity.offer : undefined;
  const game = currentActivity.type === 'play' ? currentActivity.game : undefined;

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
    }
  }, [])
};
