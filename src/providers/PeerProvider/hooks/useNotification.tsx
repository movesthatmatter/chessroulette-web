import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'debounce';
import { toISODateTime } from 'io-ts-isodatetime';
import { useDispatch, useSelector } from 'react-redux';
import { Game } from 'src/modules/Games';
import usePrevious from 'use-previous';
import { addNotification, updateOfferNotification } from '../redux/notificationActions';
import { selectRoomActivity } from '../redux/selectors';

/*
 * The debounce is need in order to ensure that both the game and the room
 * are updated to their latest state, because w/o it there is a bit of a lag
 * between the time the room update gets triggered vs the game and so there
 * is a discrpency in the logic that determines the notification states.
 */
const useDebouncedGameAndOffer = (
  game: Game,
  waitInterval = 300
) => {
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
    const now = new Date();

    if (!currentGameAndOfferZip.offer && prevGameAndOfferZip?.offer) {
      const { offer: prevOffer } = prevGameAndOfferZip;
      const { game: currentGame } = currentGameAndOfferZip;

      if (prevOffer.type === 'rematch') {
        dispatch(
          updateOfferNotification({
            notificationId: prevOffer.id,
            status: prevOffer.content.gameId !== currentGame.id ? 'accepted' : 'withdrawn',
          })
        );
      } else if (prevOffer.type === 'draw') {
        if (currentGame.state === 'stopped' && currentGame.winner === '1/2') {
          dispatch(
            updateOfferNotification({
              notificationId: prevOffer.id,
              status: 'accepted',
            })
          );
        } else {
          dispatch(
            updateOfferNotification({
              notificationId: prevOffer.id,
              status: 'withdrawn',
            })
          );
        }
      }
    } else if (currentGameAndOfferZip.offer) {
      const { offer: currentOffer } = currentGameAndOfferZip;

      switch (currentOffer.type) {
        case 'draw':
          dispatch(
            addNotification({
              notification: {
                id: currentOffer.id,
                timestamp: toISODateTime(now),
                type: 'offer',
                status: 'pending',
                offerType: 'draw',
                byUser: currentOffer.content.byUser,
                toUser: currentOffer.content.toUser,
                content: `${currentOffer.content.byUser.name} offered ${currentOffer.content.toUser.name} a draw`,
              },
            })
          );
          break;
        case 'rematch':
          dispatch(
            addNotification({
              notification: {
                id: currentOffer.id,
                timestamp: toISODateTime(now),
                type: 'offer',
                offerType: 'rematch',
                byUser: currentOffer.content.byUser,
                toUser: currentOffer.content.toUser,
                status: 'pending',
                content: `${currentOffer.content.byUser.name} is asking ${currentOffer.content.toUser.name} for a rematch`,
              },
            })
          );
          break;
      }
    }
  }, [currentGameAndOfferZip, prevGameAndOfferZip]);
};
