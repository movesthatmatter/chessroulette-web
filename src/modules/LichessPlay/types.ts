export type LichessGameState = {
  state: 'started' | 'finished';
  moves: string;
  id : string;
}

export type LichessPlayer = {
  id: string;
  name: string;
  rating: number;
}

export type LichessGame = {
  id: string;
  perf: {
    name: string;
  };
  white: LichessPlayer;
  black: LichessPlayer;
  state: LichessGameState;
}

export type LichessAPIConfig = {
  userName: string;
  token: string;
}

export type NDJsonStreamEvent = {
  read: () => Promise<{
      done: boolean;
      value: any;
  }>;
}

export type NDJsonGameEvent = {
  type : 
  | 'gameStart'
  | 'gameFinish'
  | 'challenge'
  | 'challengeCanceled'
  | 'challengeDeclined';
  game : LichessGameState |LichessGame;
}