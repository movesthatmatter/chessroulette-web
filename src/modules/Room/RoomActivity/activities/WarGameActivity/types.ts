import { WarGamePlayer, RoomWarGameActivityRecord } from 'chessroulette-io';
import { WarGame } from 'src/modules/Games';
import { RoomActivitySpecifcParticipant } from '../../utilTypes';

export type RoomWarGameActivityParticipant = RoomActivitySpecifcParticipant<
  'warGame',
  {
    isPlayer: true;
    canPlay: boolean;
    materialScore: number;
    color: WarGamePlayer['color'];
  }
>;

export type RoomWarGameActivityWithGameAndParticipating = Omit<RoomWarGameActivityRecord, 'gameId'> & {
  game: WarGame;
  iamParticipating: true;
  participants: {
    me: RoomWarGameActivityParticipant;
    opponent: RoomWarGameActivityParticipant;
  };
};

export type RoomWarGameParticipantsByColor = {
  black: RoomWarGameActivityParticipant;
  white: RoomWarGameActivityParticipant;
};

export type RoomWarGameActivityWithGameButNotParticipating = Omit<RoomWarGameActivityRecord, 'gameId'> & {
  game: WarGame;
  iamParticipating: false;
  participants: RoomWarGameParticipantsByColor;
};

export type RoomWarGameActivityWithGame =
  | RoomWarGameActivityWithGameAndParticipating
  | RoomWarGameActivityWithGameButNotParticipating;

export type RoomWarGameActivityWithoutGame = Omit<RoomWarGameActivityRecord, 'gameId'> & {
  game?: undefined;
  participants?: undefined;
};

export type RoomWarGameActivity = RoomWarGameActivityWithGame | RoomWarGameActivityWithoutGame;

