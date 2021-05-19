import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { Game } from '../types';
import { ChessGameV2, ChessGameV2Props } from '../Chess/components/ChessGameV2';
import { useGameActions } from 'src/modules/Rooms/PlayRoom/Layouts/components/GameActions/useGameActions';
import { ChessGameColor } from 'dstnd-io';
import { useSoundEffects } from '../Chess';

type Props = Omit<ChessGameV2Props, 'onMove' | 'id' | 'pgn'> & {
  game: Game; // This for now always works only with chess
  displayedPgn?: string;
};

export const GenericGame: React.FC<Props> = ({ game, displayedPgn, ...chessGameProps }) => {
  const actions = useGameActions();

  useSoundEffects(game);

  return (
    <ChessGameV2
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
