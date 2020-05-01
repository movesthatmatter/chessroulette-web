import React, { useState, useEffect, useRef } from 'react';
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

type GameState = {
  fen: string;
};

export const ChessGame: React.FunctionComponent<Props> = ({
  onMove = noop,
  fen,
  allowSinglePlayerPlay = false,
  playable = true,
  ...props
}) => {
  const cls = useStyles();
  const [gameState, setGameState] = useState<GameState>({
    fen: fen || 'start',
  });
  const game = useRef(getNewChessGame()).current;

  const awayColor = props.homeColor === 'white' ? 'black' : 'white';

  // Update the state from the prop
  // In the future, the state could only be set from outside - thinking of a case where
  //  the "fen" comes from a server like lichess.org
  useEffect(() => {
    if (fen) {
      setGameState((prevState) => ({
        ...prevState,
        fen,
      }));
    }
  }, [fen]);

  useEffect(() => {
    onMove(gameState.fen);
  }, [gameState]);

  return (
    <div className={cls.container}>
      <div className={cls.playerInfo}>
        {props.players[awayColor].name}
      </div>
      <ChessBoard
        orientation={props.homeColor}
        position={gameState.fen}
        allowDrag={(p) => {
          if (!playable) {
            return false;
          }
          return allowSinglePlayerPlay || p.piece.slice(0, 1) === props.homeColor.slice(0, 1);
        }}
        onDrop={({ sourceSquare, targetSquare }) => {
          // see if the move is legal
          const validMove = game.move({
            from: sourceSquare,
            to: targetSquare,
          });

          if (validMove === null) {
            return;
          }

          setGameState((prevState) => ({
            ...prevState,
            fen: game.fen(),
          }));
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
