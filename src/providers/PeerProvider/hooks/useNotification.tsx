import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'debounce';
import { useDispatch, useSelector } from 'react-redux';
import { Game } from 'src/modules/Games';
import usePrevious from 'use-previous';
import { addNotification, updateOfferNotification } from '../redux/notificationActions';
import { selectRoomActivity } from '../redux/selectors';
import { notificationFactory } from './utils/notificationFactory';

/*
 * The debounce is need in order to ensure that both the game and the room
 * are updated to their latest state, because w/o it there is a bit of a lag
 * between the time the room update gets triggered vs the game and so there
 * is a discrpency in the logic that determines the notification states.
 */
const useDebouncedGameAndOffer = (game: Game, waitInterval = 300) => {
  const roomActivity = useSelector(selectRoomActivity);
  const offer = roomActivity?.type === 'play' ? roomActivity.offer : undefined;

  const [gameAndOfferZip, setGameAndOfferZip] = useState({
    offer,
    game,
  });

  const debouncedUpdate = useCallback(debounce(setGameAndOfferZip, waitInterval), []);

  useEffect(() => {
    debouncedUpdate({ game, offer });
  }, [game, offer]);

  return gameAndOfferZip;
};

export const useNotification = (game: Game) => {
  const dispatch = useDispatch();
  const currentGameAndOfferZip = useDebouncedGameAndOffer(game);
  const prevGameAndOfferZip = usePrevious(currentGameAndOfferZip);

  useEffect(() => {
    const nextNotification = notificationFactory(
      currentGameAndOfferZip.game,
      currentGameAndOfferZip.offer,
      prevGameAndOfferZip?.offer,
    );

    if (nextNotification !== undefined) {
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
    }
  }, [currentGameAndOfferZip, prevGameAndOfferZip]);
};
