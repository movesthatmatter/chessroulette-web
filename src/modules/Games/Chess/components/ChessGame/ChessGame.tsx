import React from 'react';
import { Game } from '../../../types';
import { ChessBoard, ChessBoardProps } from '../ChessBoard';
import { useGameActions } from 'src/modules/Games/GameActions';
import { useSoundEffects } from '../../hooks';
import { GameStateDialogConsumer } from 'src/modules/Games/components/GameStateDialog';

export type ChessGameProps = Omit<
  ChessBoardProps,
  'onMove' | 'id' | 'pgn' | 'overlayComponent' | 'type' | 'config'
> & {
  game: Game; // This for now always works only with chess
  displayedPgn?: string;
};

export const ChessGame: React.FC<ChessGameProps> = ({ game, displayedPgn, ...chessGameProps }) => {
  const actions = useGameActions();

  useSoundEffects(game);

  return (
    <ChessBoard
      type="play"
      id={game.id}
      pgn={displayedPgn === undefined ? game.pgn : displayedPgn}
      onMove={({ move }) => {
        // TODO: Add the history here as well
        actions.onMove(move, [], chessGameProps.homeColor);
      }}
      overlayComponent={<GameStateDialogConsumer />}
      {...chessGameProps}
    />
  );
};
