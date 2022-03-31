import { ChessGameColor, UserRecord } from 'chessroulette-io';
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
		console.log('accum', accum);
		console.log('item', item);
		return {
			...accum,
			[item.round]: [...(accum[item.round] ? accum[item.round] : []), item],
		};
	}, {} as Record<number, TournamentMatchRecord[]>);
};
