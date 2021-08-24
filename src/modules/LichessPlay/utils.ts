import { ShortMove } from 'chess.js';
import { NormalMove } from 'chessops/types';
import { makeSquare, parseUci } from 'chessops/util';
import {
  ChessGameColor,
  ChessHistory,
  ChessMove,
  GameRecord,
  GuestUserRecord,
  RegisteredUserRecord,
} from 'dstnd-io';
import { ISODateTimeBrand } from 'io-ts-isodatetime/dist/lib/ISODateTime';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { getRandomInt } from 'src/lib/util';
import { console, Date } from 'window-or-global';
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
  if (status === 'finished' || status === 'mate' || status === 'outoftime') {
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

export const getPromoPieceFromMove = (promo: NonNullable<ChessMove['promotion']>) : NormalMove['promotion'] => {
  return promo === 'b' ? 'bishop' : promo === 'n' ? 'knight' : promo === 'r' ? 'rook' : 'queen';
}

const convertNormalMovePromoToShortMovePromo = (promo: NonNullable<NormalMove['promotion']>) : ShortMove['promotion'] => {
  return promo === 'bishop' ? 'b' : promo === 'knight' ? 'n' : promo === 'king' ? 'k' : promo === 'pawn' ? 'q' : promo === 'rook' ? 'r' :  'q';
}

const getLastActivityTimeAtUpdateGameStatus = (
  turn: ChessGameColor,
  gameState: LichessGameState,
  game: Game
): ISODateTimeBrand => {
  return toISODateTime(
    new Date(
      new Date(game.lastMoveAt as string).getTime() +
      new Date((gameState[turn === 'black' ? 'btime' : 'wtime'] - game.timeLeft[turn]).toString()).getTime()
    )
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
    state: history.length > 0 ? getGameState(game.state.status) : 'pending',
    timeLimit: timeLimitsMap[
      (game.clock.initial / 1000).toString() as keyof typeof timeLimitsMap
    ] as Game['timeLimit'],
    timeLeft: {
      black: game.state.btime,
      white: game.state.wtime,
    },
    updatedAt: toISODateTime(new Date()),
    ...(history.length > 0 && {
      startedAt: toISODateTime(new Date(game.createdAt)),
      pgn: historyToPgn(history),
      lastMoveBy: turn,
      lastMoveAt: getLastActivityTimeAtCreateGameStatus(turn, game),
      lastActivityAt: getLastActivityTimeAtCreateGameStatus(turn, game),
      winner: game.state.winner || undefined,
      history,
    }),
    players: [
      {
        color: 'white',
        user:
          game.white.id === user.externalAccounts?.lichess?.userId
            ? user // TODO: Convert this to UserInfo so not the whole user shows up
            : convertLichessToGuestUser(game.white),
      },
      {
        color: 'black',
        user:
          game.black.id === user.externalAccounts?.lichess?.userId
            ? user // TODO: Convert this to UserInfo so not the whole user shows up
            : convertLichessToGuestUser(game.black),
      },
    ],
    createdAt: toISODateTime(new Date(game.createdAt)),
  } as GameRecord;
  console.log('lichess game to chessroulette game ', gameRecord)
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
    lastMoveAt: toISODateTime(new Date()),
    pgn: historyToPgn(history),
    winner: lichessGameState.winner || undefined,
    history,
  } as GameRecord;
  console.log('update to chessroulette game', gameRecord)
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
      const chessMove = chess.move({
        to: makeSquare(normalMove.to),
        from: makeSquare(normalMove.from),
        ...(normalMove.promotion && {promotion: convertNormalMovePromoToShortMovePromo(normalMove.promotion)}),
      })
      gameHistory.push({
        to: makeSquare(normalMove.to),
        from: makeSquare(normalMove.from),
        color,
        ...(chessMove ? {san : chessMove.san} : {san: ''}),
        clock: gameState[color === 'white' ? 'wtime' : 'btime'],
      });
    });
  return gameHistory;
};
