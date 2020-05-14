import React, { useEffect, useState } from 'react';
import { noop } from 'src/lib/util';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { Move } from 'chess.js';
import { getBoardSize } from 'src/modules/GameRoom/util';
import { ChessBoard } from '../ChessBoard';
import { getNewChessGame } from '../../lib/sdk';
import { ChessPlayers } from '../../records';

type Props = React.HTMLProps<HTMLDivElement> & {
  players: ChessPlayers;
  playable?: boolean;
  allowSinglePlayerPlay?: boolean;
  onMove?: (pgn: string) => void;
  pgn: string;

  // The bottom side
  homeColor: 'white' | 'black';
};

export const ChessGame: React.FunctionComponent<Props> = ({
  onMove = noop,
  pgn = '',
  allowSinglePlayerPlay = false,
  playable = true,
  ...props
}) => {
  const cls = useStyles();
  const [gameInstance] = useState(getNewChessGame());
  const [fen, setFen] = useState(gameInstance.fen);
  const [history, setHistory] = useState([] as Move[]);

  useEffect(() => {
    gameInstance.load_pgn(pgn);
    setFen(gameInstance.fen());
    setHistory(gameInstance.history({ verbose: true }));
  }, [pgn]);

  return (
    <div className={cx([cls.container, props.className])}>
      <ChessBoard
        orientation={props.homeColor}
        position={fen}
        calcWidth={getBoardSize}
        history={history}
        darkSquareStyle={{
          backgroundColor: '#6792B4',
        }}
        lightSquareStyle={{
          backgroundColor: '#D7D7D7',
        }}
        allowDrag={(p) => {
          if (!playable) {
            return false;
          }
          return allowSinglePlayerPlay || p.piece.slice(0, 1) === props.homeColor.slice(0, 1);
        }}
        onDrop={({ sourceSquare, targetSquare }) => {
          // see if the move is legal
          const validMove = gameInstance.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q', // keep it simple for now
          });

          if (validMove !== null) {
            // save it here too so it's snappy fast
            setFen(gameInstance.fen());
            onMove(gameInstance.pgn());
          }
        }}
      />
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    backgroundColor: '#272729',
    boxShadow: '1px 1px 20px rgba(20, 20, 20, 0.27)',
    borderRadius: '3px',
    display: 'flex',
    flexDirection: 'column',
    width: 'fit-content',
  },
  bar: {
    fontFamily: 'Roboto',
    fontSize: '22px',
    color: 'white',
    fontWeight: 300,
    display: 'flex',
    flexDirection: 'row',
  },
});
