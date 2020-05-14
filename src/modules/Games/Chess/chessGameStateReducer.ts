import { shuffle } from 'src/lib/util';
import {
  ChessGameStatePgn,
  ChessGameColor,
  ChessGameStatePending,
  ChessGameStateStarted,
  ChessGameStateFinished,
  ChessGameStateNeverStarted,
  ChessGameTimeLimit,
} from './records';
import { otherChessColor } from './util';
import { getNewChessGame } from './lib/sdk';


const mins = (n: number) => n * 60 * 1000;

const timeLimitMsMap: {[key in ChessGameTimeLimit]: number} = {
  bullet: mins(0.3),
  blitz: mins(5),
  rapid: mins(15),
  untimed: -1,
};

export type GamePlayer = {
  id: string;
  name: string;
}

export type GamePlayersBySide = {
  home: GamePlayer;
  away: GamePlayer;
}

const getPlayerSideColor = (homeColor: ChessGameColor | 'random', players: GamePlayersBySide) => {
  if (homeColor === 'random') {
    const [white, black] = shuffle([players.home, players.away]);

    return { white, black };
  }

  if (homeColor === 'black') {
    return {
      white: players.away,
      black: players.home,
    };
  }

  return {
    white: players.home,
    black: players.away,
  };
};

export const prepareGameAction = ({
  playersBySide,
  timeLimit = 'rapid',
  homeColor = 'random',
}: {
  playersBySide: GamePlayersBySide;
  timeLimit?: ChessGameTimeLimit;
  homeColor?: ChessGameColor | 'random';
}): ChessGameStatePending => {
  const playersByColor = getPlayerSideColor(homeColor, playersBySide);

  return {
    state: 'pending',
    timeLimit,
    players: {
      white: {
        color: 'white',
        ...playersByColor.white,
      },
      black: {
        color: 'black',
        ...playersByColor.black,
      },
    },
    timeLeft: {
      white: timeLimitMsMap[timeLimit],
      black: timeLimitMsMap[timeLimit],
    },
    lastMoved: undefined,
    pgn: undefined,
    winner: undefined,
  };
};

const moveAction = (
  prev: ChessGameStatePending | ChessGameStateStarted,
  next: {
    pgn: ChessGameStatePgn;
    msSinceLastMove: number;
  },
): ChessGameStateStarted | ChessGameStateFinished => {
  // Default it to black so when the game just starts
  //  it sets the 1st move to white
  const { lastMoved: prevLastMoved = 'black' } = prev;

  const currentLastMoved = otherChessColor(prevLastMoved);

  const instance = getNewChessGame();

  instance.load_pgn(next.pgn);

  if (instance.game_over()) {
    return {
      ...prev,
      state: 'finished',
      winner: instance.in_draw() ? '1/2' : currentLastMoved,
      pgn: next.pgn as ChessGameStatePgn,
      lastMoved: currentLastMoved,
    };
  }

  const timeLeft = prev.timeLeft[currentLastMoved] - next.msSinceLastMove;

  return {
    ...prev,
    state: 'started',
    pgn: next.pgn,
    lastMoved: currentLastMoved,
    timeLeft: {
      ...prev.timeLeft,
      [currentLastMoved]: timeLeft,
    },
    winner: undefined,
  };
};

const timerFinishedAction = (
  prev: ChessGameStateStarted | ChessGameStatePending,
  next: {
    loser: ChessGameColor;
  },
): ChessGameStateNeverStarted | ChessGameStateFinished => {
  if (prev.state === 'pending') {
    return {
      ...prev,
      state: 'neverStarted',
    };
  }

  return {
    ...prev,
    state: 'finished',
    winner: otherChessColor(next.loser),
  };
};

export const actions = {
  prepareGame: prepareGameAction,
  move: moveAction,
  timerFinished: timerFinishedAction,
};
