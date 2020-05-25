
import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Box } from 'grommet';
import cx from 'classnames';
import { ChessBoard } from '../Games/Chess/components/ChessBoard';
import { ChessGame } from '../Games/Chess';
import { getBoardSize } from '../GameRoom/util';

type Props = {
  className?: string;
  bottomPadding: number;
};

export const ChessStudy: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={props.className}>
      <ChessGame
        playable
        pgn=""
        homeColor="white"
        className={cx(cls.container)}
        getBoardSize={(p) => (p.screenHeight) - props.bottomPadding}
      />
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    // background: 'red',
    // justifyContent: 'center',
    margin: '0 auto',
    // padding: 30,
  },
});
