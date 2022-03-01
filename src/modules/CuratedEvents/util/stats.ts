import { ChessPlayer, GameRecord, UserRecord } from 'chessroulette-io';
import { objectKeys, toDictIndexedBy } from 'src/lib/util';
import { Object } from 'window-or-global';
import { CuratedEvent, CuratedEventRound } from '../types';

export const getCuratedEventStats = (event: CuratedEvent) => {
  const scores = getEventRoundScores(event.rounds);

  return {
    players: getAllPlayerUserInfoFromRounds(event.rounds),
    scores,
    leaderboard: objectKeys(scores)
      .map((playerId) => ({ playerId, score: scores[playerId] }))
      .sort((a, b) => b.score - a.score),
  };
};

export const getEventRoundScores = (rounds: CuratedEvent['rounds']) => {
  return getAllGamesFromRounds(rounds).reduce((accum, nextGame) => {
    const [playerA, playerB] = nextGame.players;

    const [playerAScore, playerBScore] =
      nextGame.winner === '1/2'
        ? [0.5, 0.5]
        : [Number(playerA.color === nextGame.winner), Number(playerB.color === nextGame.winner)];

    return {
      ...accum,
      [playerA.user.id]: (accum[playerA.user.id] || 0) + playerAScore,
      [playerB.user.id]: (accum[playerB.user.id] || 0) + playerBScore,
    };
  }, {} as Record<UserRecord['id'], number>);
};

const getAllGamesFromRounds = (rr: CuratedEvent['rounds']) =>
  rr.reduce((accum, round) => [...accum, ...round.games], [] as GameRecord[]);

const getAllPlayerUserInfoFromRounds = (rr: CuratedEvent['rounds']) => {
  const allPlayers = getAllGamesFromRounds(rr).reduce(
    (accum, game) => [...accum, ...game.players.map((p) => p.user)],
    [] as ChessPlayer['user'][]
  );

  return toDictIndexedBy(allPlayers, (p) => p.id);
}
  
