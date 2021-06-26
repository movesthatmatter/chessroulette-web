import React, { useState, useEffect } from 'react';
import { Game } from '../../../types';
import { ChessBoard, ChessBoardProps } from '../ChessBoard';
import { useGameActions } from 'src/modules/Games/GameActions';
import { useSoundEffects } from '../../hooks';
import { GameStateDialogConsumer } from 'src/modules/Games/components/GameStateDialog';
import { ChessMove } from 'dstnd-io';

export type ChessGameProps = Omit<ChessBoardProps, 'onMove' | 'id' | 'pgn' | 'overlayComponent'> & {
  game: Game; // This for now always works only with chess
  displayedPgn?: string;
};

export const ChessGame: React.FC<ChessGameProps> = ({ game, displayedPgn, ...chessGameProps }) => {
  const actions = useGameActions();
  const [preMove, setPremove] = useState<ChessMove | undefined>(undefined)
  const [gameID, _] = useState(game.id);
  
  useSoundEffects(game);
  useEffect(() => {
    if (game.id === gameID){
      if (chessGameProps.homeColor !== game.lastMoveBy && preMove){
        actions.onMove(preMove, [], chessGameProps.homeColor);
      }
    }
  },[preMove, game.lastMoveBy])

  return (
    <ChessBoard
      id={game.id}
      pgn={displayedPgn === undefined ? game.pgn : displayedPgn}
      onMove={({ move }) => {
        // TODO: Add the history here as well
        actions.onMove(move, [], chessGameProps.homeColor);
      }}
      overlayComponent={<GameStateDialogConsumer />}
      {...chessGameProps}
      onPreMove={(m) => {
        setPremove(m);
      }}
    />
  );
};
