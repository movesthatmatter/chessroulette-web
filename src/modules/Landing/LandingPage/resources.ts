import { Resources } from 'chessroulette-io';
import { http } from 'src/lib/http';

const { resource: getTopPlayersResource } = Resources.Collections.Game.GetTopPlayers;

export const getTopPlayersByGamesCount = () => {
  return getTopPlayersResource.request(undefined, () => http.get('api/games/top-players'));
};

const { resource: getGameOfDayResource } = Resources.Collections.Game.GetGameOfDay;

export const getGameOfDay = () => {
  return getGameOfDayResource.request(undefined, () => http.get('api/games/game-of-day'));
};

const { resource: getMyPlayerStatsResource } = Resources.Collections.Game.GetMyPlayerStats;

export const getMyPlayerStats = () => {
  return getMyPlayerStatsResource.request(undefined, (params) =>
    http.get('api/games/my-player-stats', { params })
  );
};
