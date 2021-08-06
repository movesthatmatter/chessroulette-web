import { Color } from "chessground/types"

export type LichessGameState = {
  type: 'gameState'
  state: 'started' | 'finished' | 'resign';
  moves: string;
  id : string;
  winner: Color;
  bdraw: boolean;
  wdraw: boolean;
  binc: number;
  btime: number;
  wtime: number;
  winc: number;
}

export type LichessPlayer = {
  id: string;
  name: string;
  rating: number;
}

export type LichessGameFull= {
  type: 'gameFull'
  id: string;
  perf: {
    name: string;
  };
  clock: {
    initial: number;
    increment: number;
  };
  speed: string;
  createdAt: string;
  white: LichessPlayer;
  black: LichessPlayer;
  state: LichessGameState;
  initialFen: string;
  variant: {
    key : string;
    name: string;
    short: string;
  };
  rated: boolean;
}

export type LichessChatLine = {
  type: 'chatLine';
  username: LichessPlayer['name'];
  text: string;
  room: 'player' | 'spectator'
}

export type LichessAPIConfig = {
  userName: string;
  token: string;
}

export type NDJsonReader = {
  read: () => Promise<{
      done: boolean;
      value: any;
  }>;
}

export type LichessStreamEvent = {
  type : 
  | 'gameStart'
  | 'gameFinish'
  | 'challenge'
  | 'challengeCanceled'
  | 'challengeDeclined';
  game : LichessGame;
}

export type LichessGameStateEvent = LichessGameState & {
  type : 'gameState'
}

export type LichessGameFullEvent = LichessGame & {
  type : 'gameFull'
}

export type LichessGameEvent = LichessGameFullEvent | LichessGameStateEvent;

