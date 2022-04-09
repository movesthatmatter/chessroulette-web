import { Resources } from 'chessroulette-io';
import { http } from 'src/lib/http';

export const getUserGameArchive = (req: Resources.Util.RequestOf<typeof resource>) => {
  const { resource } = Resources.Collections.Game.GetUserGames;

  return resource.request(req, (params) => http.get(`api/games/archive`, { params }));
};
