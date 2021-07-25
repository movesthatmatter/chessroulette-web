import { RoomAnalysisActivityRecord, RoomNoActivityRecord, RoomPlayActivityRecord } from 'dstnd-io';
import { Game } from 'src/modules/Games';

export type RoomNoActivity = RoomNoActivityRecord;
export type RoomPlayActivity = RoomPlayActivityRecord & {
  game?: Game;
};

export type RoomAnalysisActivity = RoomAnalysisActivityRecord & {
  analysis?: {
    history: Game['history'];
  };
};

export type RoomActivity = RoomNoActivity | RoomPlayActivity | RoomAnalysisActivity;
