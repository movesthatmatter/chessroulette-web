import { CuratedEvent, CuratedEventRound } from '../../types';

export type RoundStatus = 'pending' | 'started' | 'finished';

export const getRoundStatus = (round: CuratedEventRound): RoundStatus => {
  const finishedGames = round.games.filter((g) => g.state === 'finished' || g.state === 'stopped');

  if (finishedGames.length === round.games.length) {
    return 'finished';
  }

  const atLeastOneStartedGame = round.games.find((g) => g.state === 'started');

  if (atLeastOneStartedGame) {
    return 'started';
  }

  return 'pending';
};

export const getInitialFocusedRound = (event: CuratedEvent) => {
  return event.rounds.find((r) => getRoundStatus(r) === 'started') || event.rounds[0];
};
