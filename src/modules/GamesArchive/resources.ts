import { Resources } from 'dstnd-io';
import { http } from 'src/lib/http';


const {
  resource: getUserGamesResource,
} = Resources.Collections.Game.GetMyGames;

export const getMyGames = () => {
  return getUserGamesResource.request(undefined, () => http.get(`api/games`));
}
