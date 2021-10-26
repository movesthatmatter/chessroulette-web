import React, { useCallback } from 'react';
import { ChessHistoryIndex, SimplePGN } from 'dstnd-io';
import { ChessBoard, ChessBoardProps } from 'src/modules/Games/Chess/components/ChessBoard';
import { ChessGameHistoryContextProps } from 'src/modules/Games/Chess/components/GameHistory';

type Props = Omit<ChessBoardProps, 'onMove' | 'type' | 'pgn'> & {
  pgn: SimplePGN;
  displayedIndex: ChessHistoryIndex;
  onAddMove: ChessGameHistoryContextProps['onAddMove'];
};

export const AnalysisBoard: React.FC<Props> = React.memo(
  ({ displayedIndex, pgn, onAddMove, ...boardProps }) => {
    const onMove = useCallback<ChessBoardProps['onMove']>(
      ({ move }) => {
        onAddMove({
          move: {
            ...move,
            clock: 0, // the clock doesn't matter on the analysis
          },
          atIndex: displayedIndex,
          withRefocus: true,
        });
      },
      [displayedIndex]
    );

    return <ChessBoard type="analysis" pgn={pgn} onMove={onMove} {...boardProps} />;
  }
);
