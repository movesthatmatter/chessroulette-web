import { Chance } from 'chance';
import { toISODateTime } from 'io-ts-isodatetime';
import { TournamentRecord } from '../types';

const chance = new Chance();

type State = Extract<TournamentRecord['state'], 'pending' | 'in_progress' | 'complete'>;

export class TournamentMocker {
	record(state: State, participantsCount: number): TournamentRecord {
		const id = String(chance.integer({ min: 1 }));
		const now = new Date();
		const yesterday = new Date(now.setDate(now.getDate() - 1));
		const tomorrow = new Date(now.setDate(now.getDate() + 1));

		const pending: TournamentRecord = {
			id,
			name: `MockedTournament-${id}`,
			description: `Pending tournament with ${participantsCount} participants`,
			createdAt: toISODateTime(yesterday),
			startedAt: null,
			startAt: toISODateTime(tomorrow),
			completedAt: null,
			state: 'pending',
			swissRounds: Math.floor(participantsCount / 2),
			participantsCount,
			tournamentType: 'swiss',
			updatedAt: null,
		};

		const started: TournamentRecord = {
			...pending,
			description: `Started Tournament with ${participantsCount} participants`,
			startedAt: toISODateTime(now),
			startAt: toISODateTime(now),
			state: 'in_progress',
			updatedAt: toISODateTime(now),
		};

		const ended: TournamentRecord = {
			...started,
			description: `Ended tournament with ${participantsCount} participants`,
			state: 'complete',
		};

		if (state === 'pending') {
			return pending;
		} else if (state === 'in_progress') {
			return started;
		} else if (state === 'complete') {
			return ended;
		}

		return pending;
	}
	pending(participantsCount: number): TournamentRecord {
		return this.record('pending', participantsCount);
	}

	started(participantsCount: number): TournamentRecord {
		return this.record('in_progress', participantsCount);
	}

	completed(participantsCount: number): TournamentRecord {
		return this.record('complete', participantsCount);
	}
}
