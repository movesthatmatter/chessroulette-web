// import { ChessGameColor, ChessColorWhite, ChessColorBlack } from './records';

import { ChessColorBlack, ChessColorWhite, ChessGameColor } from 'dstnd-io';

// I don't know why this needs to be typed like this
//  with a function declaration but if it's declared
//  as an anonymous function it throws a tsc error
export function otherChessColor<C extends ChessGameColor>(
  c: C
): C extends ChessColorWhite ? ChessColorBlack : ChessColorWhite;
export function otherChessColor<C extends ChessGameColor>(c: C) {
  return c === 'white' ? 'black' : 'white';
}
