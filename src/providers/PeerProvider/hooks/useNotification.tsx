import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'debounce';
import { toISODateTime } from 'io-ts-isodatetime';
import { useDispatch, useSelector } from 'react-redux';
import { Game } from 'src/modules/Games';
import usePrevious from 'use-previous';
import { addNotification, updateOfferNotification } from '../redux/notificationActions';
import { selectRoomActivity } from '../redux/selectors';
import { getPlayer, getPlayerByColor } from 'src/modules/GameRoomV2/util';
import { toISODate } from 'src/lib/date';

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
    const now = new Date();

    if (currentGameAndOfferZip.game.state === 'finished') {
      if (
        currentGameAndOfferZip.game.winner === 'black' ||
        currentGameAndOfferZip.game.winner === 'white'
      ) {
        dispatch(
          addNotification({
            notification: {
              type: 'info',
              infoType: 'win',
              id: `${currentGameAndOfferZip.game.id}-${currentGameAndOfferZip.game.winner}-win`,
              timestamp: toISODateTime(now),
              content: `${
                getPlayerByColor(
                  currentGameAndOfferZip.game.winner,
                  currentGameAndOfferZip.game.players
                )?.user.name
              } has won`,
            },
          })
        );
      }
    }

    if (currentGameAndOfferZip.game.state === 'stopped') {
      if (currentGameAndOfferZip.game.winner === '1/2') {
        dispatch(
          addNotification({
            notification: {
              type: 'info',
              infoType: 'draw',
              id: `${currentGameAndOfferZip.game.id}-draw`,
              timestamp: toISODateTime(now),
              content: 'Game has ended in a draw',
            },
          })
        );
      } else {
        dispatch(
          addNotification({
            notification: {
              type: 'info',
              infoType: 'resign',
              id: `${currentGameAndOfferZip.game.id}-${currentGameAndOfferZip.game.winner}-resign`,
              timestamp: toISODateTime(now),
              content: `${
                getPlayerByColor(
                  currentGameAndOfferZip.game.lastMoveBy,
                  currentGameAndOfferZip.game.players
                )?.user.name
              } has resigned.`,
            },
          })
        );
      }
    }

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
              },
            })
          );
          break;
      }
    }
  }, [currentGameAndOfferZip, prevGameAndOfferZip]);
};
