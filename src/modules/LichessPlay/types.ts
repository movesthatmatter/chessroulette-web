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

export type LichessAPIEvents = {
  onStream : undefined;
  onChallenge: undefined;
  onMove: undefined;
  onAbort: undefined;
  onAcceptChallenge: undefined;
  onDenyChallenge: undefined;
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

