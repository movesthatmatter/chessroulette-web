import { ShortMove } from 'chess.js';
import { NormalMove } from 'chessops/types';
import { makeSquare, parseUci } from 'chessops/util';
import {
  ChessGameColor,
  ChessHistory,
  GameRecord,
  GuestUserRecord,
  RegisteredUserRecord,
} from 'dstnd-io';
import { ISODateTimeBrand } from 'io-ts-isodatetime/dist/lib/ISODateTime';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { getRandomInt } from 'src/lib/util';
import { Date } from 'window-or-global';
import { Game } from '../Games';
import { gameRecordToGame, getNewChessGame, historyToPgn } from '../Games/Chess/lib';
import { LichessGameFull, LichessGameState, LichessPlayer } from './types';

export const timeLimitsMap = {
  [`30`]: `bullet30`,
  [`60`]: `bullet1`,
  [`120`]: `blitz2`,
  [`180`]: `blitz3`,
  [`300`]: `blitz5`,
  [`600`]: `rapid10`,
  [`900`]: `rapid15`,
  [`1200`]: `rapid20`,
  [`1800`]: `rapid30`,
  [`2700`]: `rapid45`,
  [`3600`]: `rapid60`,
};

export const getHomeColor = (game: LichessGameFull, userId: string): ChessGameColor => {
  return game.black.name === userId ? 'black' : 'white';
};

export const getGameState = (status: LichessGameState['status']): Game['state'] => {
  if (status === 'started') {
    return 'started';
  }
  if (status === 'resign') {
    return 'stopped';
  }
  if (status === 'finished' || status === 'mate') {
    return 'finished';
  }
  return status;
};

const convertLichessToGuestUser = (user: LichessPlayer): GuestUserRecord => {
  return {
    firstName: user.name,
    isGuest: true,
    id: user.id,
    lastName: '',
    avatarId: String(getRandomInt(1, 18)),
    name: user.name,
    sid: String(new Date().getTime()),
  };
};

const getLastActivityTimeAtCreateGameStatus = (
  turn: ChessGameColor,
  game: LichessGameFull
): ISODateTimeBrand => {
  return toISODateTime(
    new Date(
      game.createdAt + (game.clock.initial - game.state[turn === 'black' ? 'btime' : 'wtime'])
    )
  );
};

const getLastActivityTimeAtUpdateGameStatus = (
  turn: ChessGameColor,
  gameState: LichessGameState,
  game: Game
): ISODateTimeBrand => {
  return toISODateTime(
    (
      new Date(game.lastMoveAt as string).getTime() +
      new Date(gameState[turn === 'black' ? 'btime' : 'wtime'] - game.timeLeft[turn]).getTime()
    ).toString()
  );
};

export const lichessGameToChessRouletteGame = (
  game: LichessGameFull,
  user: RegisteredUserRecord
): Game => {
  const history = lichessGameStateToGameHistory(game.state);
  const turn = history.length % 2 === 0 ? 'white' : 'black';
  const gameRecord: GameRecord = {
    id: game.id,
    state: getGameState(game.state.status),
    timeLimit: timeLimitsMap[
      (game.clock.initial / 1000).toString() as keyof typeof timeLimitsMap
    ] as Game['timeLimit'],
    timeLeft: {
      black: game.state.btime,
      white: game.state.wtime,
    },
    updatedAt: toISODateTime(new Date()),
    startedAt: toISODateTime(new Date(game.createdAt)),
    players: [
      {
        color: 'white',
        user:
          game.white.id === user.externalAccounts?.lichess?.userId
            ? user
            : convertLichessToGuestUser(game.white),
      },
      {
        color: 'black',
        user:
          game.black.id === user.externalAccounts?.lichess?.userId
            ? user
            : convertLichessToGuestUser(game.black),
      },
    ],
    pgn: historyToPgn(history),
    lastMoveBy: turn,
    lastMoveAt: getLastActivityTimeAtCreateGameStatus(turn, game),
    lastActivityAt: getLastActivityTimeAtCreateGameStatus(turn, game),
    winner: game.state.winner || undefined,
    history,
    createdAt: toISODateTime(new Date(game.createdAt)),
  } as GameRecord;
  return gameRecordToGame(gameRecord);
};

export const updateGameWithNewStateFromLichess = (
  game: Game,
  lichessGameState: LichessGameState
) => {
  const history = lichessGameStateToGameHistory(lichessGameState);
  const turn = history.length % 2 === 0 ? 'white' : 'black';
  const gameRecord: GameRecord = {
    ...game,
    state: getGameState(lichessGameState.status),
    timeLeft: {
      black: lichessGameState.btime,
      white: lichessGameState.wtime,
    },
    updatedAt: toISODateTime(new Date()),
    lastMoveBy: turn,
    lastMoveAt: getLastActivityTimeAtUpdateGameStatus(turn, lichessGameState, game),
    pgn: historyToPgn(history),
    winner: lichessGameState.winner || undefined,
    history,
  } as GameRecord;
  return gameRecordToGame(gameRecord);
};

export const lichessGameStateToGameHistory = (gameState: LichessGameState): ChessHistory => {
  const chess = getNewChessGame();
  const gameHistory: ChessHistory = [];
  gameState.moves
    .split(' ')
    .filter((move) => move)
    .forEach((move, index) => {
      const normalMove = parseUci(move) as NormalMove;
      const color = index % 2 === 0 ? 'white' : 'black';
      gameHistory.push({
        to: makeSquare(normalMove.to),
        from: makeSquare(normalMove.from),
        color,
        san: chess.move({
          to: makeSquare(normalMove.to),
          from: makeSquare(normalMove.from),
          promotion: normalMove.promotion?.charAt(0) as ShortMove['promotion'],
        })!.san,
        clock: gameState[color === 'white' ? 'wtime' : 'btime'],
      });
    });
  return gameHistory;
};