import { Resources } from 'dstnd-io'
import { http } from 'src/lib/http'

const {resource : getRelayedGames} = Resources.Collections.Game.GetRelayedGames

export const getCurrentlyStreamingRelayedGames = () => {
  return getRelayedGames.request(undefined, (params) => http.get('api/games/relayed', {params}))
}

