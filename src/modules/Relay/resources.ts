import { Resources } from 'chessroulette-io';
import { http } from 'src/lib/http';

export const findRelayedGameBy = (req: Resources.Util.RequestOf<typeof resource>) => {
  const { resource } = Resources.Collections.Relay.GetRelayedGame;

  return resource.request(req, (params) => http.get('/api/relays/show', { params }));
};
