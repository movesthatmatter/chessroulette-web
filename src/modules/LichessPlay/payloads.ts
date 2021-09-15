import { LichessGameJoinRequestPayload, LichessGameUpdateRequestPayload } from "dstnd-io"
import { Game } from "src/modules/Games"
import { LichessPlayer } from "./types"

export const lichessGameActionsPayloads =  {
  onGameJoined : (game: Game, player: LichessPlayer) : LichessGameJoinRequestPayload => ({
    kind: 'lichessGameJoinRequest',
    content: {
      game,
      vendorData: {
        vendor: 'lichess',
        gameId: game.id,
        playerId: player.id,
        userRating: player.rating
      }
    } 
  }),
  onGameUpdated: (game:Game) : LichessGameUpdateRequestPayload => ({
    kind: 'lichessGameUpdateRequest',
    content: {
      game,
    }
  })
}