import { Chance } from 'chance';
import { UserInfoRecord } from 'chessroulette-io';
import { isDate } from 'date-fns/fp';
import { toISODateTime } from 'io-ts-isodatetime';
import { range, toDictIndexedBy } from 'src/lib/util';
import { TournamentRecord, TournamentWithFullDetailsRecord } from '../types';
import { TournamentMatchMocker } from './TournamentMatchMocker';
import { TournamentParticipantMocker } from './TournamentParticipantMocker';

const chance = new Chance();

type State = Extract<TournamentRecord['state'], 'pending' | 'in_progress' | 'complete'>;

const matchMocker = new TournamentMatchMocker();
const participantMocker = new TournamentParticipantMocker();

type Options =
  | {
      withLive: true;
      withUnderway: false;
    }
  | {
      withLive: false;
      withUnderway: true;
    };

export class TournamentWithFullDetailsMocker {
  record(
    state: State,
    participantsCount: number,
    props?: {
      withLive?: boolean;
      withUnderway?: boolean;
    },
    withAuthUser?: UserInfoRecord
  ): TournamentWithFullDetailsRecord {
    const id = String(chance.integer({ min: 1 }));
    const now = new Date();
    const yesterday = new Date(now.setDate(now.getDate() - 1));
    const tomorrow = new Date(now.setDate(now.getDate() + 1));

    const participants = new Array(participantsCount).fill(null).map((_, i) => {
      if (withAuthUser && i === participantsCount - 1) {
        return participantMocker.withUserDetails(withAuthUser, id);
      }
      return participantMocker.record(id);
    });

    console.log('participants', participants);

    const rounds = Math.floor(participantsCount / 2);

    const totalMatchesPerRound = Math.floor(participantsCount / 2);

    let round = 1;
    let matchesThisRound = -1;

    const matches = range(rounds * totalMatchesPerRound).map((_, i) => {
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
      // inprogress

      if (!props) {
        if (round === rounds - 1) {
          return matchMocker.record('open', round, id, [
            participants[participants.length - 1],
            participants[matchesThisRound],
          ]);
        }
      } else if (props) {
        if (round === rounds - 1) {
          return matchMocker.record(
            i % 2 === 0
              ? props.withUnderway
                ? 'underway'
                : 'open'
              : props.withLive
              ? 'inProgress'
              : 'open',
            round,
            id,
            [participants[participants.length - 1], participants[matchesThisRound]]
          );
        }
      }

      //default

      return matchMocker.record(
        round < rounds
          ? 'complete'
          : matchesThisRound > totalMatchesPerRound / 2
          ? 'pending'
          : 'open',
        round,
        id,
        [participants[matchesThisRound], participants[participants.length - 1 - matchesThisRound]]
      );
    });

    // const matches = new Array(rounds * totalMatchesPerRound).fill(null).map((_, i) => {
    // 	matchesThisRound += 1;
    // 	if (matchesThisRound === totalMatchesPerRound) {
    // 		round += 1;
    // 		matchesThisRound = 0;
    // 	}
    // 	if (state === 'pending') {
    // 		return matchMocker.record('pending', round, id, [
    // 			participants[matchesThisRound],
    // 			participants[participants.length - 1 - matchesThisRound],
    // 		]);
    // 	}
    // 	if (state === 'complete') {
    // 		return matchMocker.record('complete', round, id, [
    // 			participants[matchesThisRound],
    // 			participants[participants.length - 1 - matchesThisRound],
    // 		]);
    // 	}
    // 	if (
    // 		state === 'in_progress' &&
    // 		round === rounds - 1 &&
    // 		matchesThisRound === totalMatchesPerRound - 1 &&
    // 		!props
    // 	) {
    // 		return matchMocker.record('open', round, id, [
    // 			participants[matchesThisRound],
    // 			participants[participants.length - 1 - matchesThisRound],
    // 		]);
    // 	}
    // 	if (
    // 		state === 'in_progress' &&
    // 		round === rounds - 1 &&
    // 		matchesThisRound === totalMatchesPerRound - 1 &&
    // 		props
    // 	) {
    // 		return matchMocker.record(
    // 			props.withLive ? 'inProgress' : props.withUnderway ? 'underway' : 'open',
    // 			round,
    // 			id,
    // 			[participants[participants.length - 1], participants[matchesThisRound]]
    // 		);
    // 	}
    // 	return matchMocker.record(round < rounds ? 'complete' : 'pending', round, id, [
    // 		participants[matchesThisRound],
    // 		participants[participants.length - 1 - matchesThisRound],
    // 	]);
    // });

    const pending: TournamentWithFullDetailsRecord = {
      id,
      name: `Help the Children of Ukraine`,
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
      participants: toDictIndexedBy(participants, (p) => p.id),
      matches: toDictIndexedBy(matches, (m) => m.id),
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

  started(
    participantsCount: number,
    props?: {
      withLive?: boolean;
      withUnderway?: boolean;
    },
    withAuth?: UserInfoRecord
  ): TournamentWithFullDetailsRecord {
    return this.record('in_progress', participantsCount, props, withAuth);
  }

  completed(participantsCount: number): TournamentWithFullDetailsRecord {
    return this.record('complete', participantsCount);
  }

  // withLiveGame(participantsCount: number): TournamentWithFullDetailsRecord {
  // 	return this.record('in_progress', participantsCount, { withLive: true, withUnderway: false });
  // }

  // withUnderwayGame(participantsCount: number): TournamentWithFullDetailsRecord {
  // 	return this.record('in_progress', participantsCount, { withLive: false, withUnderway: true });
  // }

  // withUnderwayGameAndAuthenticatedUser(
  // 	participantsCount: number,
  // 	user: UserInfoRecord
  // ): TournamentWithFullDetailsRecord {
  // 	return this.record(
  // 		'in_progress',
  // 		participantsCount,
  // 		{ withLive: false, withUnderway: true },
  // 		user
  // 	);
  // }
}
