import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Game } from 'src/modules/Games';
import { notificationFactory } from './utils/notificationFactory';
import { useStateWithPrev } from 'src/lib/hooks/useStateWithPrev';
import useDebouncedEffect from 'use-debounced-effect';
import {
  addNotificationAction,
  updateOfferNotificationAction,
} from '../redux/actions';
import { selectRoomActivity } from 'src/providers/PeerProvider';

export const useRoomNotificationListener = (game: Game) => {
  const dispatch = useDispatch();
  const roomActivity = useSelector(selectRoomActivity);
  const offer = roomActivity?.type === 'play' ? roomActivity.offer : undefined;
  const [gameAndOfferZipWithPrev, setGameAndOfferZipWithPrev] = useStateWithPrev({ game, offer });

  useDebouncedEffect(
    () => {
      setGameAndOfferZipWithPrev({ game, offer });
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
    } else if (nextNotification.type === 'update') {
      dispatch(
        updateOfferNotificationAction({
          notificationId: nextNotification.id,
          status: nextNotification.status,
        })
      );
    }
  }, [gameAndOfferZipWithPrev]);
};
