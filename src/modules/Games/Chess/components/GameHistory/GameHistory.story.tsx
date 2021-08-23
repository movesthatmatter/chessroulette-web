/* eslint-disable import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';
import { ChessHistoryIndex } from 'dstnd-io';
import { addMoveToChessHistory } from 'dstnd-io/dist/analysis/analysisActions';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
import React, { useState } from 'react';
import { second } from 'src/lib/time';
import { pgnToChessHistory } from 'src/mocks/records';
import { StorybookBaseProvider } from 'src/storybook/StorybookBaseProvider';
import { colors } from 'src/theme';
import { GameHistory } from './GameHistory';

const getHistory = (pgn: string) => {
  return pgnToChessHistory(pgn, {
    white: chessGameTimeLimitMsMap.blitz3,
    black: chessGameTimeLimitMsMap.blitz3,
  });
};

export default {
  component: GameHistory,
  title: 'modules/Games/Chess/components/GameHistory',
};

export const defaultStory = () => (
  <StorybookBaseProvider>
    <div style={{ background: colors.neutralLighter }}>
      <GameHistory
        history={getHistory('1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 a6 5. Nc3 Qc7 6. Bd3 Nc6')}
        focusedIndex={2}
        onRefocus={action('on refocus')}
      />
    </div>
  </StorybookBaseProvider>
);

export const withEmptyHistory = () => (
  <StorybookBaseProvider>
    <div style={{}}>
      <GameHistory history={getHistory('')} focusedIndex={2} onRefocus={action('on refocus')} />
    </div>
  </StorybookBaseProvider>
);

export const withLongGame = () => (
  <StorybookBaseProvider>
    <div style={{}}>
      <GameHistory
        history={getHistory(
          '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 a6 5. Nc3 Qc7 6. Bd3 Nc6 7. Be3 b5 8. a3 Bb7 9. O-O Rc8 10. Nxc6 Qxc6 11. Qg4 Nf6 12. Qg3 h5 13. e5 Nd5 14. Ne4 h4 15. Qh3 Qc7 16. f4 Nxe3 17. Qxe3 h3 18. gxh3 f5 19. exf6 d5 20. Nf2 Kf7 21. Rae1 Re8 22. Qg3 g5 23. fxg5 Qxg3+ 24. hxg3 e5 25. g6+ Kxf6 26. Ng4+ Kg5 27. Rf5+ 1-0'
        )}
        focusedIndex={2}
        onRefocus={action('on refocus')}
      />
    </div>
  </StorybookBaseProvider>
);

const linearHistory = getHistory('1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 a6 5. Nc3 Qc7 6. Bd3');

const nestedMoves1Gen = [
  {
    from: 'd2',
    to: 'd4',
    san: 'd4',
    color: 'white',
    clock: second(),
  },
  {
    from: 'd7',
    to: 'd6',
    san: 'd6',
    color: 'black',
    clock: second(),
  },
  {
    from: 'c7',
    to: 'c5',
    san: 'c5',
    color: 'white',
    clock: second(),
  },
] as const;

const historyWithBranches = nestedMoves1Gen.reduce(
  (prev, nexMove) => addMoveToChessHistory(prev, nexMove, [2, 0])[0],
  linearHistory
);

const anotherMoveNestedMoves1Gen = [
  {
    from: 'd7',
    to: 'd6',
    san: 'd6',
    color: 'black',
    clock: second(),
  },
  {
    from: 'a7',
    to: 'a5',
    san: 'a5',
    color: 'white',
    clock: second(),
  },
] as const;

const historyWithTwoDifferentBranches = anotherMoveNestedMoves1Gen.reduce(
  (prev, nexMove) => addMoveToChessHistory(prev, nexMove, [5, 0])[0],
  historyWithBranches
);

export const with1LevelNestedBranches = () =>
  React.createElement(() => {
    const [focusedIndex, setFocusedIndex] = useState<ChessHistoryIndex>(2);

    return (
      <StorybookBaseProvider>
        <div style={{}}>
          <GameHistory
            history={historyWithTwoDifferentBranches}
            focusedIndex={focusedIndex}
            onRefocus={setFocusedIndex}
          />
        </div>
      </StorybookBaseProvider>
    );
  });

const anotherNestedMoves1Gen = [
  {
    from: 'd2',
    to: 'd3',
    san: 'd3',
    color: 'white',
    clock: second(),
  },
  {
    from: 'd7',
    to: 'd5',
    san: 'd5',
    color: 'black',
    clock: second(),
  },
  {
    from: 'c7',
    to: 'c5',
    san: 'c5',
    color: 'white',
    clock: second(),
  },
] as const;

const historyWithParallelBranches = anotherNestedMoves1Gen.reduce(
  (prev, nexMove) => addMoveToChessHistory(prev, nexMove, [2, 1])[0],
  historyWithBranches
);

export const withParallelNestedBranches = () =>
  React.createElement(() => {
    const [focusedIndex, setFocusedIndex] = useState<ChessHistoryIndex>(2);

    return (
      <StorybookBaseProvider>
        <div style={{}}>
          <GameHistory
            history={historyWithParallelBranches}
            focusedIndex={focusedIndex}
            onRefocus={setFocusedIndex}
          />
        </div>
      </StorybookBaseProvider>
    );
  });

const nestedMoves2Gen = [
  {
    from: 'c2',
    to: 'c4',
    san: 'c4',
    color: 'white',
    clock: second(),
  },
  {
    from: 'b7',
    to: 'b6',
    san: 'b6',
    color: 'black',
    clock: second(),
  },
  {
    from: 'a2',
    to: 'a4',
    san: 'a4',
    color: 'white',
    clock: second(),
  },
] as const;

const historyWithBranches2Gen = nestedMoves2Gen.reduce(
  (prev, nexMove, index) => addMoveToChessHistory(prev, nexMove, [2, 0, [0, 0]])[0],
  historyWithBranches
);

export const with2LevelNestedBranches = () =>
  React.createElement(() => {
    const [focusedIndex, setFocusedIndex] = useState<ChessHistoryIndex>(2);

    return (
      <StorybookBaseProvider>
        <div style={{}}>
          <GameHistory
            history={historyWithBranches2Gen}
            focusedIndex={focusedIndex}
            onRefocus={setFocusedIndex}
          />
        </div>
      </StorybookBaseProvider>
    );
  });
