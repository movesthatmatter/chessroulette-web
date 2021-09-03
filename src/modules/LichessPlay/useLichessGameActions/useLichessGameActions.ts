import useInstance from "@use-it/instance"
import { useEffect } from "react"
import { Pubsy } from "src/lib/Pubsy"
import { Game } from "src/modules/Games"
import { gameRecordToGame } from "src/modules/Games/Chess/lib"
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

  useEffect(() => {
    if (peerState.status === 'open'){
      const unsubscribers = [
        peerState.client.onMessage(payload => {
          if (payload.kind === 'lichessGameUpdateRequest' || payload.kind === 'lichessGameJoinRequest'){
            
            pubsy.publish('onGameUpdate', gameRecordToGame(payload.content.game))
          } 
        })
      ]
      return () => {
        unsubscribers.forEach(unsub => unsub()); 
      }
    }
  }, [peerState.status])

  const request: SocketClient['send'] = (payload) => {
    if (peerState.status === 'open'){
      peerState.client.sendMessage(payload)
    }
  }

  return {
    onJoinedGame: (game: Game, player:LichessPlayer) => {
      request(lichessGameActionsPayloads.onGameJoined(game, player));
    },
    onUpdateGame: (game: Game) => {
      request(lichessGameActionsPayloads.onGameUpdated(game))
    },
    onGameUpdatedEventListener: (fn: (g: Game) => void) => pubsy.subscribe('onGameUpdate', fn),
  }
}