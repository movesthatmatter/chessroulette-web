import { ShortMove } from 'chess.js';
import { NormalMove } from 'chessops/types';
import { makeSquare, parseUci } from 'chessops/util';
import {
  ChatMessageRecord,
  ChessGameColor,
  ChessGameStateFinished,
  ChessHistory,
  ChessMove,
  ChessPlayer,
  GameRecord,
  GuestUserRecord,
  RegisteredUserRecord,
} from 'dstnd-io';
import { ISODateTimeBrand } from 'io-ts-isodatetime/dist/lib/ISODateTime';
import { toISODateTime } from 'src/lib/date/ISODateTime';
import { getRandomInt } from 'src/lib/util';
import { RegisteredUserRecordWithLichessConnection } from 'src/services/Authentication';
import { console, Date, Object, pending } from 'window-or-global';
import { Game } from '../Games';
import {
  gameRecordToGame,
  getNewChessGame,
  getPlayerByColor,
  historyToPgn,
} from '../Games/Chess/lib';
import { Notification, OfferNotification, OfferType } from '../Room/RoomActivityLog/types';
import { LichessChatLine, LichessGameFull, LichessGameState, LichessPlayer } from './types';

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

const guestPrefix = 'chg-';

export const getHomeColor = (game: LichessGameFull, userId: string): ChessGameColor => {
  return game.black.name === userId ? 'black' : 'white';
};

export const getAwayColor = (game: LichessGameFull, userId: string): ChessGameColor => {
  return game.black.name === userId ? 'white' : 'black';
};

export const getGameState = (status: LichessGameState['status']): Game['state'] => {
  if (status === 'started') {
    return 'started';
  }
  if (status === 'resign' || status === 'aborted' || status === 'timeout') {
    return 'stopped';
  }
  if (
    status === 'finished' ||
    status === 'mate' ||
    status === 'outoftime' ||
    status === 'draw' ||
    status === 'stalemate'
  ) {
    return 'finished';
  }
  if (status === 'nostart') {
    return 'neverStarted';
  }
  return status;
};

const convertLichessToGuestUser = (user: LichessPlayer): GuestUserRecord => {
  return {
    firstName: user.name,
    isGuest: true,
    id: `${guestPrefix}${user.id}`,
    lastName: '',
    avatarId: String(getRandomInt(1, 18)),
    name: user.name,
    sid: `lichess-${String(new Date().getTime())}`,
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

export const getPromoPieceFromMove = (
  promo: NonNullable<ChessMove['promotion']>
): NormalMove['promotion'] => {
  return promo === 'b' ? 'bishop' : promo === 'n' ? 'knight' : promo === 'r' ? 'rook' : 'queen';
};

const convertNormalMovePromoToShortMovePromo = (
  promo: NonNullable<NormalMove['promotion']>
): ShortMove['promotion'] => {
  return promo === 'bishop'
    ? 'b'
    : promo === 'knight'
    ? 'n'
    : promo === 'king'
    ? 'k'
    : promo === 'pawn'
    ? 'q'
    : promo === 'rook'
    ? 'r'
    : 'q';
};

export const convertLichessChatLineToChatMessageRecord = (
  line: LichessChatLine
): ChatMessageRecord => {
  return {
    content: line.text,
    fromUserId: `${guestPrefix}${line.username}`,
    sentAt: toISODateTime(new Date()),
  };
};

export const filterChatLineMessage = (line: LichessChatLine, homeId: string): boolean => {
  return homeId !== line.username;
};

const getLastActivityTimeAtUpdateGameStatus = (
  turn: ChessGameColor,
  gameState: LichessGameState,
  game: Game
): ISODateTimeBrand => {
  return toISODateTime(
    new Date(
      new Date(game.lastMoveAt as string).getTime() +
        new Date(
          (gameState[turn === 'black' ? 'btime' : 'wtime'] - game.timeLeft[turn]).toString()
        ).getTime()
    )
  );
};

export const getAwayPlayer = (color: ChessGameColor, game: Game) =>
  getPlayerByColor(color === 'black' ? 'white' : 'black', game.players);

export const getHomePlayer = (color: ChessGameColor, game: Game) =>
  getPlayerByColor(color, game.players);

export const getHomePlayerFromGameAndAuth = (game: Game, auth: RegisteredUserRecordWithLichessConnection): ChessPlayer => {
  if (game.players[0].user.id === auth.id) {
    return game.players[0]
  }
  return game.players[1]
}

export const getAwayPlayerFromGameAndAuth = (game: Game, auth: RegisteredUserRecordWithLichessConnection): ChessPlayer => {
  if (game.players[0].user.id === auth.id){
    return game.players[1]
  }
  return game.players[0]
}

export const getLastPendingNotificationOfType = (
  log: {
    history: Record<Notification['id'], Notification>;
    pending?: OfferNotification;
  },
  type: OfferType
) => {
  if (log.pending?.offerType === type) {
    return log.pending;
  }
  return Object.values(log.history).sort((x, y) => {
    return new Date(x.timestamp).getTime() - new Date(x.timestamp).getTime()
  }).find(
    (s) => s.type === 'offer' && s.offerType === type && s.status === 'pending'
  );
};

export const getNumberOfOffersOfType = (
  log: {
    history: Record<Notification['id'], Notification>;
    pending?: OfferNotification;
  },
  type: OfferType
) : number => {
  return Object.values(log.history).reduce((acc, entry) => {
    if (entry.type === 'offer' && entry.offerType === type){
      return acc += 1
    }
    return acc
  }, 0)
}

export const hasPendingOffer = (
  log: {
    history: Record<Notification['id'], Notification>;
    pending? : OfferNotification;
  },
  type: OfferType
) : boolean => {
  if (log.pending && log.pending.offerType === type){
    return true;
  }
  return Object.values(log.history).filter(s => s.type === 'offer' && s.offerType === type && s.status === 'pending').length > 0;
}

export const getMessageCorrespondence = (
  senderColor: ChessGameColor,
  homeColor: ChessGameColor,
  game: Game
): Pick<OfferNotification, 'byUser' | 'toUser'> => {
  const awayPlayer = getAwayPlayer(homeColor, game);
  const homePlayer = getHomePlayer(homeColor, game);
  return {
    ...(awayPlayer.color.toLowerCase() === senderColor.toLowerCase()
      ? {
          byUser: awayPlayer.user,
          toUser: homePlayer.user,
        }
      : {
          byUser: homePlayer.user,
          toUser: awayPlayer.user,
        }),
  };
};

export const lichessGameToChessRouletteGame = (
  game: LichessGameFull,
  user: RegisteredUserRecord
): Game => {
  const history = lichessGameStateToGameHistory(game.state);
  const turn = history.length % 2 === 0 ? 'white' : 'black';
  const awayPlayer = getAwayColor(game, user.externalAccounts?.lichess?.userId as string);
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
      lastMoveBy: turn === 'black' ? 'white' : 'black',
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
    isVendorGame: true,
    vendorData: {
      vendor: 'lichess',
      userRating: game[awayPlayer].rating,
      playerId: game[awayPlayer].id,
      gameId: game.id,
    },
  } as GameRecord;
  console.log('lichess game to chessroulette game ', gameRecord);
  return gameRecordToGame(gameRecord);
};

const getWinner = (gameState: LichessGameState): ChessGameStateFinished['winner'] => {
  if (gameState.status === 'draw') {
    return '1/2';
  }
  return gameState.winner;
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
    ...(history.length === 1 && { startedAt: toISODateTime(new Date(game.createdAt)) }),
    updatedAt: toISODateTime(new Date()),
    lastMoveBy: turn === 'black' ? 'white' : 'black',
    lastMoveAt: toISODateTime(new Date()),
    lastActivityAt: toISODateTime(new Date()),
    pgn: historyToPgn(history),
    winner: getWinner(lichessGameState),
    history,
  } as GameRecord;
  console.log('update to chessroulette game', gameRecord);
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
        ...(normalMove.promotion && {
          promotion: convertNormalMovePromoToShortMovePromo(normalMove.promotion),
        }),
      });
      gameHistory.push({
        to: makeSquare(normalMove.to),
        from: makeSquare(normalMove.from),
        color,
        ...(chessMove ? { san: chessMove.san } : { san: '' }),
        clock: gameState[color === 'white' ? 'wtime' : 'btime'],
      });
    });
  return gameHistory;
};
