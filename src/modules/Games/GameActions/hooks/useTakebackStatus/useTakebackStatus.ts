import { ChessGameState, ChessPlayer, RoomWithPlayActivityRecord } from "dstnd-io";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useStateWithPrev } from "src/lib/hooks/useStateWithPrev"
import { selectCurrentRoomActivityLogHistoryOrderedArray } from "src/modules/ActivityLog/redux/selectors";
import {InfoNotification, OfferNotification} from '../../../../../modules/ActivityLog/types';

type TakeBackStatusReturn = {
  show : boolean;
}

export const useTakebackStatus = (
  game : ChessGameState, 
  meAsPlayer: ChessPlayer, 
  offer: RoomWithPlayActivityRecord['activity']['offer']
  ) : TakeBackStatusReturn => {
  const logArrayOrdered = useSelector(selectCurrentRoomActivityLogHistoryOrderedArray);
  const [gameAndOfferZipWithPrev, setGameAndOfferZipWithPrev] = useStateWithPrev({game, offer});
  const [takeBackEnabled, setTakeBackEnabled] = useState(true);

  useEffect(() => {
    setGameAndOfferZipWithPrev({game, offer})
  },[offer])

  useEffect(() => {
    if (gameAndOfferZipWithPrev.prev.offer !== undefined && gameAndOfferZipWithPrev.current.offer === undefined ){
      setGameAndOfferZipWithPrev({game, offer: undefined});
    }
  },[game.history])

  useEffect(() => {
    setTakeBackEnabled(() => {
      if (game.lastMoveBy !== meAsPlayer.color){
        return false;
      }
      if (game.history.length === 0){
        return false;
      }
      // if (logArrayOrdered.length === 0){
      //   console.log('RETURN ---- ARRAY IS 0!!!!!')
      //   return true;
      // }
      const lastNotification = logArrayOrdered[logArrayOrdered.length-1];
      // console.log('LAST NOTIFICATION ', lastNotification);
      // console.log('LOOOOOG=> ', logArrayOrdered);
      if (gameAndOfferZipWithPrev.prev.offer?.type === 'takeback'){
        if (isOfferNotification(lastNotification) && (lastNotification.status === 'withdrawn')){
          console.log('RETURN ---- LAST WITHDRAWN TAKEBACK!!!!!')
          return true;
        };
        // if (gameAndOfferZipWithPrev.prev.game.pgn !== gameAndOfferZipWithPrev.current.game.pgn){
        //   console.log('RETURN ---- OFFER WITH PREV PGN CHANGED !!!')
        //   return true
        // };
        console.log('RETURN ---- OFFER WITTH PREV IS TAKEBACK!!!!')
        return false;
      }
    // if (game.lastMoveBy !== meAsPlayer.color && gameAndOfferZipWithPrev.prev.offer?.type !== 'takeback') {
    //     console.log('RETURN ---- LAST MOVOE!!!!!!!')
    //     return false;
    // }
      console.log('RETURN ---- NO CONDITION!!!!')
      return true;
    })
  },[gameAndOfferZipWithPrev, logArrayOrdered, game])

  return {
    show: takeBackEnabled
  }
}

const isOfferNotification  =(n: OfferNotification | InfoNotification) : n is OfferNotification => n.type === 'offer';