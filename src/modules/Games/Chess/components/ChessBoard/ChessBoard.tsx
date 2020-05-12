import Chessboard from 'chessboardjsx';
import React, { useState } from 'react';
import { Move } from 'chess.js';

type Props = Chessboard['props'] & {
  history: Move[];
};

export const ChessBoard: React.FC<Props> = ({
  history,
  ...boardProps
}) => {
  const lastMove = history[history.length - 1];
  const lastMoveStyle = lastMove ? {
    [lastMove.from]: { backgroundColor: 'rgba(255, 255, 0, .4)' },
    [lastMove.to]: { backgroundColor: 'rgba(255, 255, 0, .4)' },
  } : {

  };

  return (
    <Chessboard
      {...boardProps}
      squareStyles={{
        ...lastMoveStyle,
      }}
    />
  );
};
