import { GuestUserInfoRecord, RegisteredUserInfoRecord, Resources } from 'dstnd-io';

export type UserState =
  | {
      isGuest: false;
      user: RegisteredUserInfoRecord;
      stats: PlayerStats;
    }
  | {
      isGuest: true;
      user: GuestUserInfoRecord;
    };

export type PlayerStats = Resources.AllRecords.Game.PlayerStats;
