import React, { useCallback, useMemo } from 'react';
import { Game } from '../../../types';
import { ChessBoard, ChessBoardProps } from '../ChessBoard';
import { useSoundEffects } from '../../hooks';
import { GameStateDialogConsumer } from 'src/modules/Games/components/GameStateDialog';
import { ChessGameHistoryContextProps } from '../GameHistory/ChessGameHistoryProvider/ChessGameHistoryContext';
import { noop } from 'src/lib/util';

export type ChessGameProps = Omit<
  ChessBoardProps,
  'onMove' | 'id' | 'pgn' | 'overlayComponent' | 'type' | 'config'
> & {
  game: Game; // This for now always works only with chess
};

export const RelayedChessGame: React.FC<ChessGameProps> = React.memo(
  ({ game, displayable, ...chessBoardProps }) => {
    
    useSoundEffects(game)
    
    return (
      <ChessBoard
        type='relay'
        id={game.id}
        pgn={game.pgn}
        onMove={noop}
        displayable={displayable}
        {...chessBoardProps}
      />
    );
  }
);
