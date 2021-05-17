import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Game } from 'src/modules/Games';
import { addNotification, updateOfferNotification } from '../../redux/notificationActions';
import { selectRoomActivity } from '../../redux/selectors';
import { notificationFactory } from './utils/notificationFactory';
import { useStateWithPrev } from 'src/lib/hooks/useStateWithPrev';
import useDebouncedEffect from 'use-debounced-effect';

export const useNotification = (game: Game) => {
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
      dispatch(addNotification({ notification: nextNotification.notification }));
    } else if (nextNotification.type === 'update') {
      dispatch(
        updateOfferNotification({
          notificationId: nextNotification.id,
          status: nextNotification.status,
        })
      );
    }
  }, [gameAndOfferZipWithPrev]);
};
