import { RelayedGameRecord } from 'dstnd-io/dist/resourceCollections/relay/records';
import { StreamerRecord } from 'dstnd-io/dist/resourceCollections/watch/records';
import { ISODateTime } from 'src/lib/date/ISODateTime';

export type ApiError = {
  type: 'BadRequest';
  value?: unknown;
};

export type NDJsonReaderUniversal<T> = {
  read: () => Promise<
    | {
        done: false;
        value: T
      }
    | {
        done: true;
        value: undefined;
      }
  >;
};

//TODO - have multiple games in 1 round so make it an array in the future. For now it will work for simplicity reasons
export type TournamentRound = {
  streamers: StreamerRecord[];
  date: ISODateTime,
  id: string;
  relay: RelayedGameRecord
}

export type Tournament = {
  title: string;
  rounds: TournamentRound[]
}