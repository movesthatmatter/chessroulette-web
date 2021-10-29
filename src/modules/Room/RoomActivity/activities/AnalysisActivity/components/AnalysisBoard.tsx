import { ChessHistoryIndex, SimplePGN } from 'dstnd-io';
import React, { useCallback } from 'react';
import { ChessBoard, ChessBoardProps } from 'src/modules/Games/Chess/components/ChessBoard';
import { ChessGameHistoryContextProps } from 'src/modules/Games/Chess/components/GameHistory';

type Props = Omit<ChessBoardProps, 'onMove' | 'type' | 'pgn'> & {
  pgn: SimplePGN;
  displayedIndex: ChessHistoryIndex;
  onAddMove: ChessGameHistoryContextProps['onAddMove'];
};

// Added a memo for now to optimize on the rerenders but this
//  is just a temporary patch until this is implemented:
// https://github.com/movesthatmatter/chessroulette-web/issues/149
export const AnalysisBoard: React.FC<Props> = React.memo(
  ({ pgn, displayedIndex, onAddMove, ...boardProps }) => {
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
      [displayedIndex, onAddMove]
    );

    return <ChessBoard type="analysis" pgn={pgn} onMove={onMove} {...boardProps} />;
  }
);
