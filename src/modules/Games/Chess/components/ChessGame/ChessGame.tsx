import React, { useState, useEffect, useRef } from 'react';
import { noop } from 'src/lib/util';
import { createUseStyles } from 'src/lib/jss';
import { ChessBoard } from '../ChessBoard';
import { getNewChessGame } from '../../lib/sdk';

type Props = {
  myColor: 'white' | 'black';
  allowSinglePlayerPlay?: boolean;
  onMove?: (fen: string) => void;
  fen?: string;
};

type GameState = {
  fen: string;
};

export const ChessGame: React.FunctionComponent<Props> = ({
  myColor,
  onMove = noop,
  fen,
  allowSinglePlayerPlay = true,
}) => {
  const cls = useStyles();
  const [gameState, setGameState] = useState<GameState>({
    fen: fen || 'start',
  });
  const game = useRef(getNewChessGame()).current;

  // Update the state from the prop
  // In the future, the state could only be set from outside - thinki of a case where
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
      <ChessBoard
        position={gameState.fen}
        allowDrag={(p) =>
          allowSinglePlayerPlay || p.piece.slice(0, 1) === myColor.slice(0, 1)}
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
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
});
