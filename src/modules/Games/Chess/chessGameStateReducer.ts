import { shuffle } from 'src/lib/util';
import { minutes } from 'src/lib/time';
import { toISODateTime } from 'src/lib/date/ISODateTime';
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

const timeLimitMsMap: {[key in ChessGameTimeLimit]: number} = {
  bullet: minutes(1),
  blitz: minutes(5),
  rapid: minutes(15),
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

const getPlayerSideColor = (
  homeColor: ChessGameColor | 'random',
  players: GamePlayersBySide,
) => {
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
    pgn: undefined,
    winner: undefined,

    lastMoveAt: undefined,
    lastMoveBy: undefined,
    lastMoved: undefined,
  };
};

const moveAction = (
  prev: ChessGameStatePending | ChessGameStateStarted,
  next: {
    pgn: ChessGameStatePgn;
    // msSinceLastMove: number;
  },
): ChessGameStateStarted | ChessGameStateFinished => {
  // Default it to black so when the game just starts
  //  it sets the 1st move to white
  const { lastMoved: prevLastMoved = 'black' } = prev;

  const currentLastMovedBy = otherChessColor(prevLastMoved);

  const instance = getNewChessGame();

  instance.load_pgn(next.pgn);

  // const prevLastMove = prev.lastMoveAt && new Date() || now;

  const now = new Date();
  const moveElapsedMs = prev.lastMoveAt !== undefined
    ? now.getTime() - new Date(prev.lastMoveAt).getTime()
    : 0; // Zero if first move;

  console.log('move ETA', moveElapsedMs);
  console.log('prev', prev, prev.lastMoveAt);

  if (instance.game_over()) {
    return {
      ...prev,
      state: 'finished',
      winner: instance.in_draw() ? '1/2' : currentLastMovedBy,
      pgn: next.pgn as ChessGameStatePgn,

      lastMoveAt: toISODateTime(now),
      lastMoveBy: currentLastMovedBy,
      lastMoved: currentLastMovedBy,
    };
  }

  const timeLeft = prev.timeLeft[currentLastMovedBy] - moveElapsedMs;

  return {
    ...prev,
    state: 'started',
    pgn: next.pgn,
    lastMoveAt: toISODateTime(now),
    lastMoveBy: currentLastMovedBy,
    lastMoved: currentLastMovedBy,
    timeLeft: {
      ...prev.timeLeft,
      [currentLastMovedBy]: timeLeft,
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
