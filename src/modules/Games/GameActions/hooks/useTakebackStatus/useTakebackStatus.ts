import { ChessGameState, ChessPlayer, RoomWithPlayActivityRecord } from 'chessroulette-io';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useStateWithPrev } from 'src/lib/hooks/useStateWithPrev';
import { selectCurrentRoomActivityLogHistoryOrderedArray } from 'src/modules/Room/RoomActivityLog/redux/selectors';
import {
  InfoNotification,
  Notification,
  OfferNotification,
} from 'src/modules/Room/RoomActivityLog/types';

type TakeBackStatusReturn = {
  show: boolean;
};

// TODO: I don't believe we actually need this one, as the whole logic is already built for notifications
//  and game actions
export const useTakebackStatus = (
  game: ChessGameState,
  meAsPlayer: ChessPlayer,
  offer: RoomWithPlayActivityRecord['activity']['offer']
): TakeBackStatusReturn => {
  const logArrayOrdered = useSelector(selectCurrentRoomActivityLogHistoryOrderedArray);
  const [gameAndOfferZipWithPrev, setGameAndOfferZipWithPrev] = useStateWithPrev({ game, offer });
  const [takeBackEnabled, setTakeBackEnabled] = useState(true);

  useEffect(() => {
    setGameAndOfferZipWithPrev({ game, offer });
  }, [offer]);

  useEffect(() => {
    if (
      gameAndOfferZipWithPrev.prev.offer !== undefined &&
      gameAndOfferZipWithPrev.current.offer === undefined
    ) {
      setGameAndOfferZipWithPrev({ game, offer: undefined });
    }
  }, [game.history]);

  useEffect(() => {
    setTakeBackEnabled(() => {
      if (game.lastMoveBy !== meAsPlayer.color) {
        return false;
      }
      if (game.history.length === 0) {
        return false;
      }
      const lastNotification = logArrayOrdered[logArrayOrdered.length - 1];
      if (gameAndOfferZipWithPrev.prev.offer?.type === 'takeback') {
        if (isOfferNotification(lastNotification) && lastNotification.status === 'withdrawn') {
          return true;
        }
        return false;
      }
      return true;
    });
  }, [gameAndOfferZipWithPrev, logArrayOrdered, game]);

  return {
    show: takeBackEnabled,
  };
};

const isOfferNotification = (n: Notification): n is OfferNotification => n.type === 'offer';
