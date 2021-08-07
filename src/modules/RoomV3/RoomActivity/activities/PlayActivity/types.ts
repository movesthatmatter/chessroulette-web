import { ChessPlayer, RoomPlayActivityRecord } from 'dstnd-io';
import { Game } from 'src/modules/Games';
import { RoomActivitySpecifcParticipant } from '../../utilTypes';

export type RoomPlayActivityParticipant = RoomActivitySpecifcParticipant<
  'play',
  {
    isPlayer: true;
    canPlay: boolean;
    materialScore: number;
    color: ChessPlayer['color'];
  }
>;

export type RoomPlayActivityWithGameAndParticipating = Omit<RoomPlayActivityRecord, 'gameId'> & {
  game: Game;
  iamParticipating: true;
  participants: {
    me: RoomPlayActivityParticipant;
    opponent: RoomPlayActivityParticipant;
  };
};

export type RoomPlayActivityWithGameButNotParticipating = Omit<RoomPlayActivityRecord, 'gameId'> & {
  game: Game;
  iamParticipating: false;
  participants: {
    black: RoomPlayActivityParticipant;
    white: RoomPlayActivityParticipant;
  };
};

export type RoomPlayActivityWithGame =
  | RoomPlayActivityWithGameAndParticipating
  | RoomPlayActivityWithGameButNotParticipating;

export type RoomPlayActivityWithoutGame = Omit<RoomPlayActivityRecord, 'gameId'> & {
  game?: undefined;
  participants?: undefined;
};

export type RoomPlayActivity = RoomPlayActivityWithGame | RoomPlayActivityWithoutGame;
