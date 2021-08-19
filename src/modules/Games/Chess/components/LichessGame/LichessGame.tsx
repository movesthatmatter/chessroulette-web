import React, { useEffect } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { GameStateDialogConsumer } from 'src/modules/Games/components/GameStateDialog';
import { Game } from 'src/modules/Games/types';
import { console } from 'window-or-global';
import { useSoundEffects } from '../../hooks';
import { ChessBoard, ChessBoardProps } from '../ChessBoard';

type LichessGameProps = Omit<ChessBoardProps, 'onMove' | 'id' | 'pgn' | 'overlayComponent'> & {
  game: Game;
  displayedPgn?: string;
};

export const LichessGame: React.FC<LichessGameProps> = (props) => {
  const {game, displayedPgn, ...chessGameProps} = props;
  const cls = useStyles();

  useSoundEffects(game);

  return (
    <ChessBoard
      id={game.id}
      pgn={displayedPgn === undefined ? game.pgn : displayedPgn}
      onMove={({ move }) => {
        
      }}
      overlayComponent={<GameStateDialogConsumer />}
      {...chessGameProps}
    />
  );
};

const useStyles = createUseStyles({
  container: {},
});