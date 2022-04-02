import { Chance } from 'chance';
import { toISODateTime } from 'io-ts-isodatetime';
import { TournamentRecord, TournamentWithFullDetailsRecord } from '../types';
import { TournamentMatchMocker } from './TournamentMatchMocker';
import { TournamentParticipantMocker } from './TournamentParticipantMocker';

const chance = new Chance();

type State = Extract<TournamentRecord['state'], 'pending' | 'in_progress' | 'complete'>;

const matchMocker = new TournamentMatchMocker();
const participantMocker = new TournamentParticipantMocker();

export class TournamentWithFullDetailsMocker {
	record(
		state: State,
		participantsCount: number,
		withLive?: boolean
	): TournamentWithFullDetailsRecord {
		const id = String(chance.integer({ min: 1 }));
		const now = new Date();
		const yesterday = new Date(now.setDate(now.getDate() - 1));
		const tomorrow = new Date(now.setDate(now.getDate() + 1));

		const participants = new Array(participantsCount)
			.fill(null)
			.map((_) => participantMocker.record(id));

		console.log('participants', participants);

		const rounds = Math.floor(participantsCount / 2);

		const totalMatchesPerRound = Math.floor(participantsCount / 2);

		let round = 1;
		let matchesThisRound = -1;

		const matches = new Array(rounds * totalMatchesPerRound).fill(null).map((_, i) => {
			matchesThisRound += 1;
			if (matchesThisRound === totalMatchesPerRound) {
				round += 1;
				matchesThisRound = 0;
			}
			if (state === 'pending') {
				return matchMocker.record('pending', round, id, [
					participants[matchesThisRound],
					participants[participants.length - 1 - matchesThisRound],
				]);
			}
			if (state === 'complete') {
				return matchMocker.record('complete', round, id, [
					participants[matchesThisRound],
					participants[participants.length - 1 - matchesThisRound],
				]);
			}
			if (state === 'in_progress' && withLive && i === rounds - 1) {
				return matchMocker.record('open', round, id, [
					participants[matchesThisRound],
					participants[participants.length - 1 - matchesThisRound],
				]);
			}
			return matchMocker.record(
				round > Math.floor(rounds / 2) ? 'pending' : 'complete',
				round,
				id,
				[participants[matchesThisRound], participants[participants.length - 1 - matchesThisRound]]
			);
		});

		console.log('matches :', matches);

		const pending: TournamentWithFullDetailsRecord = {
			id,
			name: `MockedTournament-${id}`,
			description: `Pending tournament with ${participantsCount} participants`,
			createdAt: toISODateTime(yesterday),
			startedAt: null,
			startAt: toISODateTime(tomorrow),
			completedAt: null,
			state: 'pending',
			swissRounds: rounds,
			participantsCount,
			tournamentType: 'swiss',
			updatedAt: null,
			participants,
			matches,
		};

		const started: TournamentWithFullDetailsRecord = {
			...pending,
			description: `Started Tournament with ${participantsCount} participants`,
			startedAt: toISODateTime(now),
			startAt: toISODateTime(now),
			state: 'in_progress',
			updatedAt: toISODateTime(now),
		};

		const ended: TournamentWithFullDetailsRecord = {
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

	pending(participantsCount: number): TournamentWithFullDetailsRecord {
		return this.record('pending', participantsCount);
	}

	started(participantsCount: number): TournamentWithFullDetailsRecord {
		return this.record('in_progress', participantsCount);
	}

	completed(participantsCount: number): TournamentWithFullDetailsRecord {
		return this.record('complete', participantsCount);
	}

	withLiveGame(participantsCount: number): TournamentWithFullDetailsRecord {
		return this.record('in_progress', participantsCount, true);
	}
}
