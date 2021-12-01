import { Resources } from 'dstnd-io';
import { http } from 'src/lib/http';

const { resource: getRelayedGamesResource } = Resources.Collections.Relay.GetRelayedGames;

export const getCurrentlyStreamingRelayedGames = () => {
  return getRelayedGames({
    gameStates: ['started', 'pending'],
  });
};

export const getRelayedGames = (req?: Resources.Util.RequestOf<typeof getRelayedGamesResource>) => {
  return getRelayedGamesResource.request(req || {}, (params) => http.get('api/relays', { params }));
};
