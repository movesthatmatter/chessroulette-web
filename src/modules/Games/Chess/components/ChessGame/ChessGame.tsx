import React from 'react';
import { Game } from '../../../types';
import { ChessBoard, ChessBoardProps } from '../ChessBoard';
import { useGameActions } from 'src/modules/Games/GameActions';
import { useSoundEffects } from '../../hooks';


type Props = Omit<ChessBoardProps, 'onMove' | 'id' | 'pgn'> & {
  game: Game; // This for now always works only with chess
  displayedPgn?: string;
};

export const ChessGame: React.FC<Props> = ({ game, displayedPgn, ...chessGameProps }) => {
  const actions = useGameActions();

  useSoundEffects(game);

  return (
    <ChessBoard
      id={game.id}
      pgn={displayedPgn === undefined ? game.pgn : displayedPgn}
      onMove={({ move }) => {
        // TODO: Add the history here as well
        actions.onMove(move, [], chessGameProps.homeColor);
      }}
      {...chessGameProps}
    />
  );
};
