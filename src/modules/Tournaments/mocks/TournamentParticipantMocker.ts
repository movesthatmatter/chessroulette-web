import { Chance } from 'chance';
import { UserInfoRecord } from 'chessroulette-io';
import { UserRecordMocker } from 'src/mocks/records';
import { TournamentParticipantRecord } from '../types';

const chance = new Chance();
const userRecordMock = new UserRecordMocker();

export class TournamentParticipantMocker {
	record(): TournamentParticipantRecord;
	record(tournamentId: string): TournamentParticipantRecord;
	record(tournamentId?: string): TournamentParticipantRecord {
		return {
			id: String(chance.integer({ min: 1 })),
			tournamentId: tournamentId || String(chance.integer({ min: 1 })),
			user: userRecordMock.record(),
		};
	}
	withUserDetails(user: UserInfoRecord, tournamentId: string): TournamentParticipantRecord {
		return {
			id: String(chance.integer({ min: 1 })),
			tournamentId: tournamentId,
			user,
		};
	}
}
