import { Color } from 'chessground/types';

export type LichessGameState = {
  type: 'gameState';
  status:
    | 'started'
    | 'finished'
    | 'resign'
    | 'mate'
    | 'outoftime'
    | 'aborted'
    | 'resign'
    | 'stalemate'
    | 'timeout'
    | 'draw'
    | 'nostart';
  moves: string;
  id: string;
  winner: Color;
  bdraw: boolean;
  wdraw: boolean;
  binc: number;
  btime: number;
  wtime: number;
  winc: number;
};

export type LichessPlayer = {
  id: string;
  name: string;
  rating: number;
};

export type LichessGameFull = {
  type: 'gameFull';
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
    key: string;
    name: string;
    short: string;
  };
  rated: boolean;
};

export type LichessGameStartEvent = {
  type: 'gameStart';
  game: {
    id: string;
    source: string;
  };
};

export type LichessGameFinishEvent = {
  type: 'gameFinish';
  game: {
    id: string;
    source: string;
  };
};

export type LichessChallenge = {
  challenger: LichessPlayer;
  color: Color;
  destUser: LichessPlayer;
  id: string;
  perf: {
    name: string;
  };
  rated: boolean;
  speed: string;
  status: string;
  timeControl: {
    type: string;
  };
  url: string;
  variant: {
    key: string;
    name: string;
    short: string;
  };
};

export type LichessChallengeEvent = {
  type: 'challenge' | 'challengeAccepted' | 'challengeDeclined' | 'challengeCancelled';
  challenge: LichessChallenge;
};

export type LichessGameEvent =
  | LichessGameFull
  | LichessGameState
  | LichessGameStartEvent
  | LichessGameFinishEvent;

export type LichessSystemBaseChatLine = {
    type : 'chatLine';
    username: 'lichess';
    room?: 'player';
}

export type LichessGeneralChatLine = {
  type: 'chatLine';
  username: LichessPlayer['name'];
  text: string;
  room: 'player' | 'spectator';
};


export type LichessTakebackOffer = LichessSystemBaseChatLine & {
  text: 'Takeback sent'
}

export type LichessTakebackAcceptedLine = LichessSystemBaseChatLine & {
  text: 'Takeback accepted'
}

export type LichessTakebackCancelledLine = LichessSystemBaseChatLine & {
  text: 'Takeback declined' | 'Takeback cancelled'
}

export type LichessTakebackOfferLine = 
| LichessTakebackAcceptedLine
| LichessTakebackCancelledLine
| LichessTakebackOffer

export type LichessDrawOffer = LichessSystemBaseChatLine & {
  text: 'White offers draw' | 'Black offers draw'
}

export type LichessDrawAcceptLine = LichessSystemBaseChatLine & {
  text: 'Draw offer accepted'
}

export type LichessDrawCancelledLine = LichessSystemBaseChatLine & {
  text: 'White declines draw' | 'Black declines draw'
} 

export type LichessDrawOfferLine = 
| LichessDrawOffer
| LichessDrawAcceptLine
| LichessDrawCancelledLine

export type LichessSystemChatLines = 
| LichessTakebackOfferLine
| LichessDrawOfferLine

export type LichessChatLine = 
| LichessGeneralChatLine
| LichessSystemChatLines


export type LichessAPIConfig = {
  userName: string;
  token: string;
};

export type NDJsonReader = {
  read: () => Promise<
    | {
        done: false;
        value: LichessGameEvent | LichessChallengeEvent | LichessChatLine;
      }
    | {
        done: true;
        value: undefined;
      }
  >;
};
