import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { floatingShadow, softBorderRadius } from 'src/theme';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';

type Props = {
  size: number;
};

export const NoActivity: React.FC<Props> = ({ size }) => {
  const cls = useStyles();

  return (
    <ChessBoard
      size={size}
      id="empty-frozen-board" // TODO: This might need to change
      pgn=""
      homeColor="white"
      onMove={() => {}}
      className={cls.board}
    />
  );
};

const useStyles = createUseStyles({
  board: {
    ...floatingShadow,
    ...softBorderRadius,
    overflow: 'hidden',
  },
});
