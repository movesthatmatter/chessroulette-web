import useInstance from "@use-it/instance"
import { useSelector } from "react-redux"
import { Pubsy } from "src/lib/Pubsy"
import { Game } from "src/modules/Games"
import { selectGame } from "src/modules/Room/RoomActivity/redux/selectors"
import { usePeerState } from "src/providers/PeerProvider"
import { SocketClient } from "src/services/socket/SocketClient"
import { console } from "window-or-global"
import { useLichessProvider } from "../LichessAPI/useLichessProvider"
import { LichessPlayer } from "../types"
import { lichessGameActionsPayloads } from "./payloads"

type Events = {
  onGameUpdate: Game
}

export const useLichessGameActions = () => {
  const peerState = usePeerState()
  const pubsy = useInstance<Pubsy<Events>>(new Pubsy<Events>());
  const lichess = useLichessProvider();
  const game = useSelector(selectGame);

  const request: SocketClient['send'] = (payload) => {
    if (peerState.status === 'open'){
      peerState.client.sendMessage(payload)
    }
  }

  return {
    onJoinedGame: (game: Game, player:LichessPlayer) => {
      request(lichessGameActionsPayloads.onGameJoined(game, player));
      pubsy.publish('onGameUpdate', game);
    },
    onUpdateGame: (game: Game) => {
      console.log('UPDATED GAME --- > ',game);
      request(lichessGameActionsPayloads.onGameUpdated(game))
      pubsy.publish('onGameUpdate', game)
    },
    onGameUpdatedEventListener: (fn: (g: Game) => void) => pubsy.subscribe('onGameUpdate', fn),
    onDrawAccept: () => {
      if (lichess && game){
        lichess.acceptDraw(game.vendorData?.gameId as string);

      }
    },
    onDrawDecline: () => {
      if (lichess && game){
        lichess.declineDraw(game.vendorData?.gameId as string)
      }
    },
  }
}