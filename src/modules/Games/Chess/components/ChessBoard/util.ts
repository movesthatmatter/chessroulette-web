import { Key } from 'chessground/types';
import { ChessInstance, Piece } from 'chess.js';
import { ChessGameColor, ChessGameStateFen, ChessGameStatePgn, ChessMove } from 'dstnd-io';
import { keyInObject } from 'src/lib/util';
import { toChessColor } from '../../lib';
import { ChessgroundProps } from 'react-chessground';
import { ChessBoardConfig, ChessBoardGameState, ChessBoardType } from './types';

export type ChessDests = Map<Key, Key[]>;

export function toDests(chess: ChessInstance): ChessDests {
  const dests = new Map();
  chess.SQUARES.forEach((s) => {
    const ms = chess.moves({ square: s, verbose: true });
    if (ms.length)
      dests.set(
        s,
        ms.map((m) => m.to)
      );
  });
  return dests;
}

export const isInitialFen = (fen: ChessGameStateFen) => {
  return fen === '' || fen === 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
};

export const isPromotableMove = (piece: Piece, { to: toSquare }: ChessMove) => {
  if (piece.type !== 'p') {
    return false;
  }

  return (
    (piece.color === 'b' &&
      keyInObject(
        {
          a1: true,
          b1: true,
          c1: true,
          d1: true,
          e1: true,
          f1: true,
          g1: true,
          h1: true,
        },
        toSquare
      )) ||
    (piece.color === 'w' &&
      keyInObject(
        {
          a8: true,
          b8: true,
          c8: true,
          d8: true,
          e8: true,
          f8: true,
          g8: true,
          h8: true,
        },
        toSquare
      ))
  );
};

export const getCurrentChessBoardGameState = (
  props: CalcMovaleProps,
  chess: ChessInstance,
  prev: ChessBoardGameState | undefined
): ChessBoardGameState => {
  // Offer a way to exit asap if nothing changed
  if (chess.fen() === prev?.fen) {
    return prev;
  }

  const history = chess.history({ verbose: true });
  const lastMove = history[history.length - 1] as ChessMove;

  return {
    fen: chess.fen(),
    pgn: chess.pgn(),
    turn: toChessColor(chess.turn()),
    inCheck: chess.in_check(),
    lastMove,
    lastMoveFromTo: lastMove ? [lastMove.from, lastMove.to] : undefined,
    isPreMovable: history.length === 0 ? true : history[history.length - 1].color !== chess.turn(),
    movable: calcMovable(props, toDests(chess)),
  };
};

type CalcMovaleProps = {
  type: ChessBoardType;
  canInteract?: boolean;
  playable?: boolean;
  config?: ChessBoardConfig;
  playableColor: ChessGameColor;
};

const calcMovable = (props: CalcMovaleProps, dests: ChessDests): ChessgroundProps['movable'] => {
  const base = {
    free: false,
    // This is what determines wether someone can move a piece!
    dests: props.canInteract && props.playable ? dests : undefined,
    showDests: !!props.config?.showDests,
  } as const;

  if (props.type === 'analysis') {
    return {
      ...base,
      color: 'both',
    };
  }

  if (props.type === 'play') {
    return {
      ...base,
      color: props.playableColor,
    };
  }

  return {
    ...base,
    free: true,
    color: 'both',
  };
};
