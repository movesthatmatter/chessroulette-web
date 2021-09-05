import useInstance from "@use-it/instance"
import { Pubsy } from "src/lib/Pubsy"
import { Game } from "src/modules/Games"
import { usePeerState } from "src/providers/PeerProvider"
import { SocketClient } from "src/services/socket/SocketClient"
import { LichessPlayer } from "../types"
import { lichessGameActionsPayloads } from "./payloads"

type Events = {
  onGameUpdate: Game
}

export const useLichessGameActions = () => {
  const peerState = usePeerState()
  const pubsy = useInstance<Pubsy<Events>>(new Pubsy<Events>());

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
      request(lichessGameActionsPayloads.onGameUpdated(game))
      pubsy.publish('onGameUpdate', game)
    },
    onGameUpdatedEventListener: (fn: (g: Game) => void) => pubsy.subscribe('onGameUpdate', fn),
  }
}