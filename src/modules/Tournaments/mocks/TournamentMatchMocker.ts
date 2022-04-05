import { Chance } from 'chance';
import {
	TournamentCompleteMatchRecord,
	TournamentInProgressMatchRecord,
	TournamentMatchPlayerBlack,
	TournamentMatchPlayerWhite,
	TournamentOpenMatchRecord,
	TournamentPendingMatchRecord,
	TournamentUnderwayMatchRecord,
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
			winner: undefined,
			players: [whitePlayer, blackPlayer],
			startedAt: toISODateTime(now),
		};

		const underway: TournamentUnderwayMatchRecord = {
			...open,
			state: 'underway',
			underwayAt: toISODateTime(now),
		};

		const inProgress: TournamentInProgressMatchRecord = {
			...open,
			state: 'inProgress',
			underwayAt: toISODateTime(now),
			gameId: String(chance.integer({ min: 1 })),
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
		} else if (state === 'underway') {
			return underway;
		} else if (state === 'complete') {
			return complete;
		} else if (state === 'inProgress') {
			return inProgress;
		}

		return pending;
	}
	pending(): TournamentMatchRecord {
		return this.record('pending');
	}

	open(): TournamentMatchRecord {
		return this.record('open');
	}

	underway(): TournamentMatchRecord {
		return this.record('underway');
	}

	inProgress(): TournamentMatchRecord {
		return this.record('inProgress');
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

	openWithTournamentAndParticipants(
		round: number,
		tournamentId: string,
		participants: [TournamentParticipantRecord, TournamentParticipantRecord]
	): TournamentMatchRecord {
		return this.record('open', round, tournamentId, participants);
	}

	underWayWithTournamentAndParticipants(
		round: number,
		tournamentId: string,
		participants: [TournamentParticipantRecord, TournamentParticipantRecord]
	): TournamentMatchRecord {
		return this.record('underway', round, tournamentId, participants);
	}

	inProgressWithTournamentAndParticipants(
		round: number,
		tournamentId: string,
		participants: [TournamentParticipantRecord, TournamentParticipantRecord]
	): TournamentMatchRecord {
		return this.record('inProgress', round, tournamentId, participants);
	}

	completedWithTournamentAndParticipants(
		round: number,
		tournamentId: string,
		participants: [TournamentParticipantRecord, TournamentParticipantRecord]
	): TournamentMatchRecord {
		return this.record('complete', round, tournamentId, participants);
	}
}
