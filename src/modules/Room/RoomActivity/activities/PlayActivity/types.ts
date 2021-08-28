import { ChessPlayer, RoomLichessActivityRecord, RoomPlayActivityRecord } from 'dstnd-io';
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

export type RoomLichessActivityGues = Pick<RoomActivitySpecifcParticipant<'lichess'>, 'roomActivitySpecificParticipantType' | 'userId'> & {
  isPlayer: true;
  canPlay: true
  color: ChessPlayer['color']
}

export type RoomLichessActivityParticipant = RoomActivitySpecifcParticipant<
'lichess',
{
  isPlayer: true;
  canPlay: boolean;
  materialScore: number;
  color: ChessPlayer['color']
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

export type LichessRoomActivityWithGame = Omit<RoomLichessActivityRecord, 'gameId'> & {
  game: Game;
  participants: {
    me: RoomLichessActivityParticipant
    opponent: RoomLichessActivityGues
  }
}

export type LichessRoomActivityWithoutGame = Omit<RoomLichessActivityRecord, 'gameId'> & {
  game? : undefined;
  participants? :undefined;
}

export type RoomLichessActivity = LichessRoomActivityWithGame | LichessRoomActivityWithoutGame;

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

