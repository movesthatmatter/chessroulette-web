import { Key } from 'chessground/types';
import { ChessInstance, Move, Piece } from 'chess.js';
import { ChessGameColor, ChessGameStateFen, ChessHistory, ChessMove, SimplePGN } from 'dstnd-io';
import { keyInObject } from 'src/lib/util';
import { toChessColor } from '../../lib';
import { ChessgroundProps } from 'react-chessground';
import { ChessBoardConfig, ChessBoardGameState, ChessBoardType } from './types';
import { console } from 'window-or-global';

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

type CalcMovableProps = {
  type: ChessBoardType;
  playableColor?: ChessGameColor;
  canInteract?: boolean;
  playable?: boolean;
  config?: ChessBoardConfig;
  displayable?: {
    fen: ChessGameStateFen;
    pgn: SimplePGN;
    history: ChessHistory;
  };
};

// I'm thinking this should be returned by the Chess library (both on the server and on client)
//  after an action like move (or any other), with a checksum type of identifier (probably fen)
//  to easily compare. It will be generated on the client upon move, saved and displayed right away
//  and when it eventually comes back from the server there's no more need to update because the 
//  fens will be the same! This can't be done by reference, which then means it either needs to be
//  compared at the moment of receive on the client by checking the history, thus being expensive or,
//  just reupdated, which triggers another render (thus being again expensive)
//  There might be an even easier way to do it – based on some trust, that if a move was made then it
//  must be right, but I don't know yet if that suffices.
// 
// I like the idea that if a gameUpdated is received, jsut checking one checksum (fen) aginst the client
//  will be enough to decide wether the update is really needed or not!
// 
// TODO: scheduled for @deprecation for the above reasons
export const getCurrentChessBoardGameState = (
  props: CalcMovableProps,
  chess: ChessInstance,
  prev: ChessBoardGameState | undefined
): ChessBoardGameState => {
  const pgn = chess.pgn();

  // Offer a way to exit asap if nothing changed
  if (pgn === prev?.pgn && props.displayable?.fen === prev.displayable?.fen) {
    return prev;
  }

  const history = chess.history({ verbose: true });
  const fen = chess.fen();

  return {
    pgn,
    fen,
    history,
    displayable: getDisplayableState(
      {
        history,
        fen,
      },
      props.displayable
    ),
    turn: toChessColor(chess.turn()),
    inCheck: chess.in_check(),
    isPreMovable: history.length === 0 ? true : history[history.length - 1].color !== chess.turn(),
    movable: calcMovable(props, toDests(chess)),
  };
};

const getDisplayableState = (
  current: {
    history: Move[];
    fen: ChessGameStateFen;
  },
  displayable?: CalcMovableProps['displayable']
): ChessBoardGameState['displayable'] => {
  // If there are no displayable or they are exactly the same then just show the current
  if (!displayable || current.fen === displayable.fen) {
    const lastMove = current.history[current.history.length - 1] as ChessMove;

    return {
      fen: current.fen,
      lastMoveFromTo: lastMove ? [lastMove.from, lastMove.to] : undefined,
    };
  }

  const displayableLastMove = displayable.history[displayable.history.length - 1] as ChessMove;

  return {
    fen: displayable.fen,
    lastMoveFromTo: displayableLastMove
      ? [displayableLastMove.from, displayableLastMove.to]
      : undefined,
  };
};

const calcMovable = (props: CalcMovableProps, dests: ChessDests): ChessgroundProps['movable'] => {
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

  if (props.type === 'relay'){
    return {
      ...base,
      dests : undefined,
      showDests: false,
      color: 'both'
    } as const;
  }

  return {
    ...base,
    free: true,
    color: 'both',
  };
};
