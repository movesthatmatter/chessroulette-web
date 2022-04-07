import { ChessGameColor, UserInfoRecord, UserRecord } from 'chessroulette-io';
import { TournamentWithFullDetailsRecord } from 'chessroulette-io/dist/resourceCollections/tournaments/records';
import { toDictIndexedBy } from 'src/lib/util';
import { TournamentMatchRecord } from './types';
// import { ChallongeMatchRecord } from 'chessroulette-io/dist/resourceCollections/tournaments/records';

// export function determineParticipatingColor(
// 	match: ChallongeMatchRecord,
// 	participantId: string | null
// ): ChessGameColor | undefined {
// 	let result = false;
// 	if (!participantId) return undefined;
// 	if (match.player1_id && match.player1_id.toString() === participantId) {
// 		return 'white';
// 	}
// 	if (match.player2_id && match.player2_id.toString() === participantId) {
// 		return 'black';
// 	}
// 	return undefined;
// }

export const indexMatchesByRound = (
  matches: TournamentWithFullDetailsRecord['matches'],
  rounds: number
): Record<number, TournamentMatchRecord[]> => {
  return matches.reduce((accum, item) => {
    return {
      ...accum,
      [item.round]: [...(accum[item.round] ? accum[item.round] : []), item],
    };
  }, {} as Record<number, TournamentMatchRecord[]>);
};

export const determineNoWinsAndPointsPerParticipant = (
  matches: TournamentWithFullDetailsRecord['matches']
): Record<string, { wins: number; points: number; user: UserInfoRecord }> => {
  return matches.reduce((accum, match) => {
    if (!match.players) return accum;
    const blackId = match.players[1].user.id;
    const whiteId = match.players[0].user.id;
    if (!match.winner) {
      return {
        ...accum,
        ...(!(whiteId in accum) && {
          [whiteId]: { wins: 0, points: 0, user: match.players[0].user },
        }),
        ...(!(blackId in accum) && {
          [blackId]: { wins: 0, points: 0, user: match.players[1].user },
        }),
      };
    }
    if (match.winner === 'white') {
      return {
        ...accum,
        [whiteId]:
          whiteId in accum
            ? {
                ...accum[whiteId],
                wins: accum[whiteId].wins += 1,
                points: accum[whiteId].points += 1,
              }
            : {
                wins: 1,
                points: 1,
                user: match.players[0].user,
              },
        ...(!(blackId in accum) && {
          [blackId]: { wins: 0, points: 0, user: match.players[1].user },
        }),
      };
    } else if (match.winner === 'black') {
      return {
        ...accum,
        [blackId]:
          blackId in accum
            ? {
                ...accum[blackId],
                wins: accum[blackId].wins += 1,
                points: accum[blackId].points += 1,
              }
            : {
                wins: 1,
                points: 1,
                user: match.players[1].user,
              },
        ...(!(whiteId in accum) && {
          [whiteId]: { wins: 0, points: 0, user: match.players[0].user },
        }),
      };
    } else if (match.winner === '1/2') {
      return {
        ...accum,
        [whiteId]:
          whiteId in accum
            ? {
                ...accum[whiteId],
                points: accum[whiteId].points += 0.5,
              }
            : {
                wins: 0,
                points: 0.5,
                user: match.players[0].user,
              },
        [blackId]:
          blackId in accum
            ? {
                ...accum[blackId],
                points: accum[blackId].points += 0.5,
              }
            : {
                wins: 0,
                points: 0.5,
                user: match.players[1].user,
              },
      };
    }
    return accum;
  }, {} as Record<string, { wins: number; points: number; user: UserInfoRecord }>);
};

export const isUserAMatchParticipant = (m: TournamentMatchRecord, userId: UserRecord['id']) => {
  if (m.state === 'pending') {
    return false;
  }

  return m.players[0].user.id === userId || m.players[1].user.id === userId;
};
