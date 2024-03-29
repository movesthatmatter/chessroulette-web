import { UserInfoRecord } from 'chessroulette-io';

export const getUserDisplayName = (u: UserInfoRecord) => u.isGuest ? u.name : `@${u.username}`;

export const getUserDisplayNameClean = (u: UserInfoRecord) => u.isGuest ? u.name : u.username;
