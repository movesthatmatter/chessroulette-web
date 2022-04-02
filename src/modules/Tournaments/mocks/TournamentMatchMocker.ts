import { Chance } from 'chance';
import {
	TournamentCompleteMatchRecord,
	TournamentMatchPlayerBlack,
	TournamentMatchPlayerWhite,
	TournamentOpenMatchRecord,
	TournamentPendingMatchRecord,
} from 'chessroulette-io/dist/resourceCollections/tournaments/records';
import { toISODate, toISODateTime } from 'io-ts-isodatetime';
import { getRandomInt } from 'src/lib/util';
import { UserRecordMocker } from 'src/mocks/records';
import { TournamentMatchRecord, TournamentParticipantRecord } from '../types';

const chance = new Chance();
const userMocker = new UserRecordMocker();
type State = TournamentMatchRecord['state'];

export class TournamentMatchMocker {
	record(
		state: State,
		round: number,
		tournamentId: string,
		participants: [TournamentParticipantRecord, TournamentParticipantRecord]
	): TournamentMatchRecord;
	record(state: State): TournamentMatchRecord;
	record(
		state: State,
		round?: number,
		tournamentId?: string,
		participants?: [TournamentParticipantRecord, TournamentParticipantRecord]
	): TournamentMatchRecord {
		const id = String(chance.integer({ min: 1 }));
		const now = new Date();
		const yesterday = new Date(now.setDate(now.getDate() - 1));
		const tomorrow = new Date(now.setDate(now.getDate() + 1));

		const whitePlayer: TournamentMatchPlayerWhite = participants
			? {
					externalParticipantId: participants[0].id,
					color: 'white',
					user: participants[0].user,
			  }
			: {
					externalParticipantId: String(chance.integer({ min: 1 })),
					color: 'white',
					user: userMocker.record(),
			  };

		const blackPlayer: TournamentMatchPlayerBlack = participants
			? {
					externalParticipantId: participants[1].id,
					color: 'black',
					user: participants[1].user,
			  }
			: {
					externalParticipantId: String(chance.integer({ min: 1 })),
					color: 'black',
					user: userMocker.record(),
			  };

		const pending: TournamentPendingMatchRecord = {
			id,
			slug: String(id),
			state: 'pending',
			externalMatchId: String(chance.integer({ min: 1 })),
			tournamentId: tournamentId || String(chance.integer({ min: 1 })),
			createdAt: toISODateTime(yesterday),
			updatedAt: toISODateTime(now),
			scheduledAt: toISODateTime(tomorrow),
			round: round || 1,
			gameId: undefined,
			winner: undefined,
			players: undefined,
			startedAt: undefined,
			completedAt: undefined,
			underwayAt: undefined,
		};

		const open: TournamentOpenMatchRecord = {
			...pending,
			state: 'open',
			gameId: String(chance.integer({ min: 1 })),
			winner: undefined,
			players: [whitePlayer, blackPlayer],
			startedAt: toISODateTime(now),
		};

		const winner: TournamentCompleteMatchRecord['winner'][] = ['white', '1/2', 'black'];

		const complete: TournamentCompleteMatchRecord = {
			...open,
			state: 'complete',
			gameId: String(chance.integer({ min: 1 })),
			winner: winner[getRandomInt(0, 2)],
			completedAt: toISODateTime(now),
			startedAt: toISODateTime(yesterday),
			updatedAt: toISODateTime(now),
			underwayAt: toISODateTime(yesterday),
			scheduledAt: toISODateTime(yesterday),
		};

		if (state === 'pending') {
			return pending;
		} else if (state === 'open') {
			return open;
		} else if (state === 'complete') {
			return complete;
		}

		return pending;
	}
	pending(): TournamentMatchRecord {
		return this.record('pending');
	}

	started(): TournamentMatchRecord {
		return this.record('open');
	}

	completed(): TournamentMatchRecord {
		return this.record('complete');
	}
	pendingWithTournamentAndParticipants(
		round: number,
		tournamentId: string,
		participants: [TournamentParticipantRecord, TournamentParticipantRecord]
	): TournamentMatchRecord {
		return this.record('pending', round, tournamentId, participants);
	}

	startedWithTournamentAndParticipants(
		round: number,
		tournamentId: string,
		participants: [TournamentParticipantRecord, TournamentParticipantRecord]
	): TournamentMatchRecord {
		return this.record('open', round, tournamentId, participants);
	}

	completedWithTournamentAndParticipants(
		round: number,
		tournamentId: string,
		participants: [TournamentParticipantRecord, TournamentParticipantRecord]
	): TournamentMatchRecord {
		return this.record('complete', round, tournamentId, participants);
	}
}
