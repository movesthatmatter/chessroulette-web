import { ChessInstance } from "chess.js";
import { ChessGameColor, ChessGameState, ChessHistory, GameRecord, GuestUserRecord, RegisteredUserRecord, UserRecord } from "dstnd-io";
import { ISODateTimeBrand } from "io-ts-isodatetime/dist/lib/ISODateTime";
import { toISODateTime } from "src/lib/date/ISODateTime";
import { getRandomInt } from "src/lib/util";
import { console, Date } from "window-or-global";
import { Game } from "../Games";
import { gameRecordToGame, historyToPgn } from "../Games/Chess/lib";
import { LichessGameFull, LichessGameState, LichessPlayer } from "./types";

export const timeLimitsMap = {  
  [`30`] : `bullet30`,
  [`60`] : `bullet1`,
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

export const getHomeColor = (game: LichessGameFull, userId: string) : ChessGameColor => {
  return game.black.name === userId? 'black' : 'white';
}

export const  getGameState = (status: LichessGameState['status']) : Game['state'] => {
  if (status === 'started'){
    return 'started'
  }
  if (status === 'resign'){
    return 'stopped'
  }
  if (status === 'finished' || status === 'mate'){
    return 'finished'
  }
  return status;
}

const convertLichessToGuestUser = (user: LichessPlayer): GuestUserRecord => {
  return {
    firstName: user.name,
    isGuest: true,
    id: user.id,
    lastName: '',
    avatarId: String(getRandomInt(1, 18)),
    name: user.name,
    sid: String(new Date().getTime())
  }
}

const getLastMoveAtTime = (turn: ChessGameColor, game: LichessGameFull) : ISODateTimeBrand => {
  return toISODateTime(new Date(game.createdAt + (game.clock.initial - game.state[turn === 'black' ? 'btime' : 'wtime'])));
}

export const lichessStateToGame = (game:LichessGameFull, user: RegisteredUserRecord, history: ChessHistory): Game  => {
  const turn = history.length % 2 === 0 ? 'white' : 'black';
  const gameRecord: GameRecord = {
    id: game.id,
    state : getGameState(game.state.status),
    timeLimit: timeLimitsMap[(game.clock.initial/1000).toString() as keyof typeof timeLimitsMap] as Game['timeLimit'],
    timeLeft: {
      black: game.state.btime,
      white: game.state.wtime
    },
    updatedAt: toISODateTime(new Date()),
    startedAt: toISODateTime(new Date(game.createdAt)),
    players: [
      {
        color: 'white',
        user : game.white.id === user.externalAccounts?.lichess?.userId ? user : convertLichessToGuestUser(game.white)
      }, {
        color: 'black',
        user : game.black.id === user.externalAccounts?.lichess?.userId ? user : convertLichessToGuestUser(game.black)
      }
    ],
    pgn: historyToPgn(history),
    lastMoveBy: turn,
    lastMoveAt: getLastMoveAtTime(turn, game),
    lastActivityAt: getLastMoveAtTime(turn, game),
    winner: game.state.winner || undefined,
    history,
    createdAt: toISODateTime(new Date(game.createdAt)),
  } as GameRecord;
  return gameRecordToGame(gameRecord);
}