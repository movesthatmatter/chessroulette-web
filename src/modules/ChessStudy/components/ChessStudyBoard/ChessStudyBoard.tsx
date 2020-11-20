import React from 'react';
import { ShortMove } from 'chess.js';
import { noop } from 'src/lib/util';
import {
  ChessBoard,
  ChessBoardProps,
} from 'src/modules/Games/Chess/components/ChessBoard';
import { MoveHistory } from '../../types';

export type ChessStudyBoardProps = ChessBoardProps & {
  history: MoveHistory;
  playable?: boolean;

  onMove?: (m: ShortMove) => void;
};

export const ChessStudyBoard: React.FC<ChessStudyBoardProps> = ({
  history,
  onMove = noop,
  ...boardProps
}) => (
  <ChessBoard
    {...boardProps}
    history={history}
    // onSquareClickMove={(p) => onMove({ from: p.sourceSquare, to: p.targetSquare })}
    onDrop={(p) => onMove({ from: p.sourceSquare, to: p.targetSquare })}
  />
);
