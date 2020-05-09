import React from 'react';
import { noop } from 'src/lib/util';
import { createUseStyles } from 'src/lib/jss';
import { ChessBoard } from '../ChessBoard';
import { getNewChessGame } from '../../lib/sdk';
import { ChessPlayers } from '../../records';

type Props = {
  players: ChessPlayers;
  playable?: boolean;
  allowSinglePlayerPlay?: boolean;
  onMove?: (fen: string) => void;
  fen?: string;

  // The bottom side
  homeColor: 'white' | 'black';
};


export const ChessGame: React.FunctionComponent<Props> = ({
  onMove = noop,
  fen = getNewChessGame().fen(),
  allowSinglePlayerPlay = false,
  playable = true,
  ...props
}) => {
  const cls = useStyles();

  const awayColor = props.homeColor === 'white' ? 'black' : 'white';

  return (
    <div className={cls.container}>
      <div className={cls.playerInfo}>
        {props.players[awayColor].name}
      </div>
      <ChessBoard
        orientation={props.homeColor}
        position={fen}
        allowDrag={(p) => {
          if (!playable) {
            return false;
          }
          return allowSinglePlayerPlay || p.piece.slice(0, 1) === props.homeColor.slice(0, 1);
        }}
        onDrop={({ sourceSquare, targetSquare }) => {
          const game = getNewChessGame(fen);

          // see if the move is legal
          const validMove = game.move({
            from: sourceSquare,
            to: targetSquare,
          });

          if (validMove !== null) {
            const nextFen = game.fen();

            onMove(nextFen);
          }
        }}
      />
      <div className={cls.playerInfo}>
        {props.players[props.homeColor].name}
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
  playerInfo: {},
});
