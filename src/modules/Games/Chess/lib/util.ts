import { ChessInstance, ShortMove, Piece, Square } from 'chess.js';
import { Result, Ok, Err } from 'ts-results';
import { getNewChessGame } from './sdk';
import {
  ChessGameColor,
  ChessGameState,
  ChessGameStatePgn,
  chessGameUtils,
  ChessHistory,
  ChessHistoryBlackMove,
  ChessHistoryMove,
  ChessHistoryWhiteMove,
  ChessMove,
  ChessPlayer,
  ChessPlayerBlack,
  ChessPlayersBySide,
  ChessPlayerWhite,
  GameRecord,
  UserRecord,
} from 'chessroulette-io';
import {
  FullMove,
  PairedMove,
  PairedHistory,
  PartialWhiteMove,
  PartialBlackMove,
  PartialMove,
} from './types';
import { flatten } from 'src/lib/util';
import { getRelativeMaterialScore } from '../components/GameStateWidget/util';
import { Game, GameFromGameState } from '../../types';
import { chessHistoryToSimplePgn } from 'chessroulette-io/dist/chessGame/util/util';

export const getStartingPgn = () => getNewChessGame().pgn();
export const getStartingFen = () => getNewChessGame().fen();

export const getGameFromPgn = (pgn: string): Result<ChessInstance, void> => {
  const engine = getNewChessGame();

  if (engine.load_pgn(pgn)) {
    return new Ok(engine);
  }

  return new Err(undefined);
};

export const getSquareForPiece = (pgn: string, lookupPiece: Piece) => {
  const engine = getNewChessGame();

  const validPgn = engine.load_pgn(pgn);

  if (!validPgn) {
    return undefined;
  }

  return engine.SQUARES.find((sq) => {
    const p = engine.get(sq);

    return p?.color === lookupPiece.color && p?.type === lookupPiece.type;
  });
};

export const toChessColor = (c: 'w' | 'white' | 'b' | 'black') => {
  return c === 'b' || c === 'black' ? 'black' : 'white';
};

export const isPartialMove = (pm: PairedMove): pm is PartialMove =>
  isPartialWhiteMove(pm) || isPartialBlackMove(pm);
export const isPartialWhiteMove = (pm: PairedMove): pm is PartialWhiteMove =>
  Array.isArray(pm) && pm.length === 1 && pm[0].color === 'white';
export const isPartialBlackMove = (pm: PairedMove): pm is PartialBlackMove =>
  Array.isArray(pm) && pm.length === 1 && pm[0].color === 'black';

export const isChessHistoryBlackMove = (m: ChessHistoryMove): m is ChessHistoryBlackMove =>
  m.color === 'black';
export const isChessHistoryWhiteMove = (m: ChessHistoryMove): m is ChessHistoryWhiteMove =>
  m.color === 'white';

export const isFullMove = (pm: PairedMove): pm is FullMove =>
  Array.isArray(pm) &&
  pm.length === 2 &&
  !!pm[0] &&
  pm[0].color === 'white' &&
  !!pm[1] &&
  pm[1].color === 'black';

export const toPairedHistory = (history: ChessHistory): PairedHistory =>
  history.reduce((prev, next) => {
    const currentPartialMove: PartialMove = [next];

    // If the length is zero just return the partial move
    //  Note (could be a black one as well if the history starts in the middle)
    if (prev.length === 0) {
      return [currentPartialMove];
    }

    // If the previous move is a partial white and the current move is a partial black
    //  then just merge them
    const prevPartialMove = prev.slice(-1)[0];
    if (isPartialWhiteMove(prevPartialMove) && isPartialBlackMove(currentPartialMove)) {
      const prevWithoutLast = prev.slice(0, -1);
      const nextFullMove: FullMove = [prevPartialMove[0], currentPartialMove[0]];
      return [...prevWithoutLast, nextFullMove];
    }

    // Otherwise just append the current white partial move to prev
    return [...prev, currentPartialMove];
  }, [] as PairedHistory);

export const pairedHistoryToHistory = (ph: PairedHistory): ChessHistory =>
  (flatten(ph) as unknown) as ChessHistory;

// [0] - The PairedMove index
// [1] - The color/side index
export type PairedIndex = [number, number];

export const linearToPairedIndex = (history: ChessHistory, index: number): PairedIndex => {
  return [Math.floor(index / 2), index % 2];
};

export const pairedToLinearIndex = (index: PairedIndex) => index[0] * 2 + index[1];

export const reversedLinearIndex = (history: ChessHistory, index: number) =>
  history.length - index - 1;

// @deprecated in favor of the safer chessHistoryToSimplePgn
export const historyToPgn = (moves: ChessHistory): ChessGameStatePgn =>
  toPairedHistory(moves)
    .map(
      (pm, index) =>
        isFullMove(pm)
          ? `${index + 1}. ${pm[0].san} ${pm[1].san}` // full move
          : isPartialWhiteMove(pm)
          ? `${index + 1}. ${pm[0].san}` // halfMove
          : '' // if a PartialBlackMove do nothing as this won't be a valid PGN
    )
    .join(' ');

export const pgnToFen = (pgn: ChessGameStatePgn) => getNewChessGame(pgn).fen();

export const pgnToHistory = (pgn: ChessGameStatePgn) =>
  getNewChessGame(pgn).history({ verbose: true });

export const historyToFen = (h: ChessHistory) => pgnToFen(chessHistoryToSimplePgn(h));

export const inCheckMate = (pgn: ChessGameStatePgn) => getNewChessGame(pgn).in_checkmate();
export const inCheck = (pgn: ChessGameStatePgn) => getNewChessGame(pgn).in_check();
export const inDraw = (pgn: ChessGameStatePgn) => getNewChessGame(pgn).in_draw();
export const isGameOver = (pgn: ChessGameStatePgn) => getNewChessGame(pgn).game_over();

export const getTurn = (pgn: ChessGameStatePgn) => getNewChessGame(pgn).turn();
export const getSquare = (pgn: ChessGameStatePgn, square: Square) =>
  getNewChessGame(pgn).get(square);
export const isValidMove = (pgn: ChessGameStatePgn, m: ChessMove) =>
  getNewChessGame(pgn).move(m) !== null;
export const getPgnAfterMove = (
  pgn: ChessGameStatePgn,
  m: ChessMove
): Result<ChessGameStatePgn, void> => {
  const instance = getNewChessGame(pgn);

  if (instance.move(m)) {
    return new Ok(instance.pgn());
  }

  return Err(undefined);
};

// @Deprecate as it's not used
export const getGameAfterMove = (
  move: ShortMove,
  fromPgn?: string
): Result<ChessInstance, void> => {
  const engine = fromPgn ? getGameFromPgn(fromPgn) : new Ok(getNewChessGame());

  if (engine.unwrap()?.move(move)) {
    return engine;
  }

  return new Err(undefined);
};

export type UserAsPlayerStats =
  | {
      isPlayer: true;
      player: ChessPlayer;
      opponent: ChessPlayer | undefined;
      canPlay: boolean;
      materialScore: number;
    }
  | {
      isPlayer: false;
      player: undefined;
      opponent: undefined;
      canPlay: false;
      materialScore: undefined;
    };

// TODO: Deprecate in favor of PlayRoomActivity stats
export const getPlayerStats = (game: Game, userId: UserRecord['id']): UserAsPlayerStats => {
  const player = getPlayer(userId, game.players);

  if (player) {
    const opponent = getOppositePlayer(player, game.players);
    const materialScore = getRelativeMaterialScore(game);

    const canPlay =
      // I must have an opponent to be able to play
      !!opponent &&
      // game must be in playable mode
      (game.state === 'pending' || game.state === 'started') &&
      // It must be my turn or be white if first move
      (game.lastMoveBy ? game.lastMoveBy === opponent.color : player.color === 'white');

    return {
      isPlayer: true,
      player,
      opponent,
      canPlay,
      materialScore: materialScore[player.color],
    } as const;
  }

  return defaultPlayerStats;
};

export const defaultPlayerStats: UserAsPlayerStats = {
  player: undefined,
  isPlayer: false,
  opponent: undefined,
  canPlay: false,
  materialScore: undefined,
};

export const gameRecordToGame = <T extends ChessGameState>(g: T) => {
  return {
    ...g,
    activePieces: chessGameUtils.getActivePieces(chessGameUtils.simplePGNtoMoves(g.pgn || '')),
  } as GameFromGameState<T>;
};

export const getGameFromHistory = (history: ChessHistory = []) => {
  const instance = getNewChessGame();

  // TODO: This might not be the most efficient
  //  but it's ok for now to ensure the validaty of the pgn
  history.forEach((move) => {
    instance.move(move);
  });

  return instance;
};

// A Safe way to get the opponent from the given player
// If the given player is not actually part of players then return undefined
//  since now there can be no opposite
export const getOppositePlayer = (fromPlayer: ChessPlayer, players: ChessGameState['players']) => {
  if (!isPlayer(fromPlayer.user.id, players)) {
    return undefined;
  }

  return players[0].user.id === fromPlayer.user.id ? players[1] : players[0];
};

export const isPlayer = (userId: string, players: ChessGameState['players']) =>
  !!players.find((p) => p.user.id === userId);

export const getPlayer = (
  userId: string,
  players: ChessGameState['players']
): ChessPlayer | undefined => {
  if (players[0].user.id === userId) {
    return players[0];
  }

  if (players[1]?.user.id === userId) {
    return players[1];
  }

  return undefined;
};

export const getPlayerByColor = (color: ChessGameColor, players: ChessGameState['players']) => {
  return players[0].color === color ? players[0] : players[1];
};

// Added on Oct 7th 2021. These are the future and do belong in the dstnd-io
type ChessPlayersByColor = {
  white: ChessPlayerWhite;
  black: ChessPlayerBlack;
};

// These belong in the Chess Game IO Repo
export const toChessPlayersByColor = ([
  playerA,
  playerB,
]: GameRecord['players']): ChessPlayersByColor => {
  if (playerA.color === 'white' && playerB.color === 'black') {
    return {
      white: playerA,
      black: playerB,
    };
  }

  return {
    // This is needed because otherwise Typescript Fails but this is correct
    white: playerB as ChessPlayerWhite,
    black: playerA as ChessPlayerBlack,
  };
};

// These belong in the Chess Game IO Repo
export const toChessPlayersBySide = (
  players: GameRecord['players'],
  homeColor: ChessGameColor
): ChessPlayersBySide => {
  const playersByColor = toChessPlayersByColor(players);

  if (playersByColor.white.color === homeColor) {
    return {
      home: playersByColor.white,
      away: playersByColor.black,
    };
  }

  return {
    home: playersByColor.black,
    away: playersByColor.white,
  };
};

export const invertChessPlayersSide = (players: ChessPlayersBySide): ChessPlayersBySide => {
  return {
    away: players.home,
    home: players.away,
  } as ChessPlayersBySide;
};
