import Chessboard from 'chessboardjsx';
import React from 'react';

type Props = Chessboard['props'];

export const ChessBoard: React.FC<Props> = (props: Props = {}) => (
  <Chessboard {...props} />
);
