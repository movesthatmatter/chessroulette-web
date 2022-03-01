import { Resources } from 'chessroulette-io';
import { http } from 'src/lib/http';

const { resource: getUserGamesResource } = Resources.Collections.Game.GetUserGames;

export const getUserGames = (req: Resources.Util.RequestOf<typeof getUserGamesResource>) => {
  return getUserGamesResource.request(req, (params) => http.get(`api/games`, { params }));
};
