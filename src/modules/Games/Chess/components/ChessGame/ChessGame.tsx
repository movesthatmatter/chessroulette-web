import React, { useCallback, useMemo } from 'react';
import { Game } from '../../../types';
import { ChessBoard, ChessBoardProps } from '../ChessBoard';
import { useSoundEffects } from '../../hooks';
import { GameStateDialogConsumer } from 'src/modules/Games/components/GameStateDialog';
import { ChessGameHistoryContextProps } from '../GameHistory/ChessGameHistoryProvider/ChessGameHistoryContext';

export type ChessGameProps = Omit<
  ChessBoardProps,
  'onMove' | 'id' | 'pgn' | 'overlayComponent' | 'type' | 'config'
> & {
  game: Game; // This for now always works only with chess
  onAddMove: ChessGameHistoryContextProps['onAddMove'];
};

export const ChessGame: React.FC<ChessGameProps> = React.memo(
  ({ game, displayable, onAddMove, ...chessBoardProps }) => {
    const onMove = useCallback<ChessBoardProps['onMove']>(
      ({ move }) => {
        onAddMove({
          move: {
            ...move,
            // This isn't important at move time on the client as it will be added by the server
            clock: 0,
          },
          withRefocus: true,
        });
      },
      [onAddMove]
    );

    useSoundEffects(game);

    // Performance Optimization
    // See http://bit.ly/wdyr02 ":Children / React Elements" for more info
    const memoizedOverlayComponent = useMemo(() => <GameStateDialogConsumer />, []);

    return (
      <ChessBoard
        type="play"
        id={game.id}
        pgn={game.pgn}
        onMove={onMove}
        displayable={displayable}
        overlayComponent={memoizedOverlayComponent}
        {...chessBoardProps}
      />
    );
  }
);
