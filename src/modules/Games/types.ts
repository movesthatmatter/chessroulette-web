import {
  ActivePiecesRecord,
  ChessGameState,
  GameRecord,
  WarGameRecord,
  GameRecordFromGameState,
} from 'dstnd-io';
import { RoomPlayActivityParticipant } from '../Room/RoomActivity/activities/PlayActivity';
import { RoomWarGameActivityParticipant } from '../Room/RoomActivity/activities/WarGameActivity/types';

export type Game = GameRecord & {
  activePieces: ActivePiecesRecord;
};

export type WarGame = WarGameRecord & {
  // activePieces: ActivePiecesRecord;
}

export type GameFromGameState<
  TGameState extends ChessGameState
> = GameRecordFromGameState<TGameState> & {
  activePieces: ActivePiecesRecord;
};

export type PlayParticipants = {
  away: RoomPlayActivityParticipant;
  home: RoomPlayActivityParticipant;
};

export type WarGameParticipants = {
  away: RoomWarGameActivityParticipant;
  home: RoomWarGameActivityParticipant;
}

export type BoardOrientation = 'home' | 'away';
