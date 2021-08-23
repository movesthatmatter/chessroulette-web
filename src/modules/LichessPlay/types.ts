import { Color } from "chessground/types"

export type LichessGameState = {
  type: 'gameState';
  status: 'started' | 'finished' | 'resign' | 'mate' | 'outoftime';
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

export type LichessGameStartEvent = {
  type: 'gameStart';
  game: {
    id: string;
    source: string;
  }
}

export type LichessGameFinishEvent = {
  type: 'gameFinish';
  game: {
    id: string;
    source: string;
  }
}

export type LichessChallenge = {
  challenger : LichessPlayer;
  color: Color;
  destUser: LichessPlayer;
  id: string;
  perf: {
    name: string;
  }
  rated: boolean;
  speed: string;
  status : string;
  timeControl: {
    type:string;
  };
  url: string;
  variant: {
    key: string;
    name: string;
    short: string;
  }
}

export type LichessChallengeEvent = {
  type : 'challenge' | 'challengeAccepted' | 'challengeDeclined' | 'challengeCancelled';
  challenge: LichessChallenge
}

export type LichessGameEvent = 
| LichessGameFull 
| LichessGameState 
| LichessGameStartEvent
| LichessGameFinishEvent

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
  read: () => Promise<
  {
      done: false;
      value: LichessGameEvent | LichessChallengeEvent | LichessChatLine;
  } | 
  {
    done: true;
    value: undefined;
  }>;
}

