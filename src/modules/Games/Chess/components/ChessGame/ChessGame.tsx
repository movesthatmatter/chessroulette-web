import React, { useCallback, useMemo } from 'react';
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

export const ChessGame: React.FC<ChessGameProps> = React.memo(
  ({ game, displayedPgn, ...chessBoardProps }) => {
    const actions = useGameActions();

    const onMove = useCallback<ChessBoardProps['onMove']>(
      ({ move }) => {
        // TODO: Add the history here as well
        actions.onMove(move, [], chessBoardProps.playableColor);
      },
      [actions]
    );

    useSoundEffects(game);

    // Performance Optimization
    // See http://bit.ly/wdyr02 ":Children / React Elements" for more info
    const memoizedOverlayComponent = useMemo(() => <GameStateDialogConsumer />, []);

    return (
      <ChessBoard
        type="play"
        id={game.id}
        pgn={displayedPgn === undefined ? game.pgn : displayedPgn}
        onMove={onMove}
        overlayComponent={memoizedOverlayComponent}
        {...chessBoardProps}
      />
    );
  }
);
