import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { floatingShadow, softBorderRadius } from 'src/theme';
import { ChessBoard } from 'src/modules/Games/Chess/components/ChessBoard';
import { console } from 'window-or-global';

type Props = {
  size: number;
};

export const AnalysisActivity: React.FC<Props> = ({ size }) => {
  const cls = useStyles();

  return (
    <ChessBoard
      size={size}
      id="analysis-board" // TODO: This might need to change
      pgn=""
      homeColor="white"
      onMove={(m) => {
        console.log('on move', m);
      }}
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
