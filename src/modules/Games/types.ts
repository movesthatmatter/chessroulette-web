import {
  ActivePiecesRecord,
  ChessGameState,
  GameRecord,
  GameRecordFromGameState,
} from 'dstnd-io';
import { RoomPlayActivityParticipant } from '../Room/RoomActivity/activities/PlayActivity';

export type Game = GameRecord & {
  activePieces: ActivePiecesRecord;
};

export type GameFromGameState<
  TGameState extends ChessGameState
> = GameRecordFromGameState<TGameState> & {
  activePieces: ActivePiecesRecord;
};

export type PlayParticipants = {
  away: RoomPlayActivityParticipant;
  home: RoomPlayActivityParticipant;
};

export type BoardOrientation = 'home' | 'away';
