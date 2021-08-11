import { action } from '@storybook/addon-actions';
import { chessGameTimeLimitMsMap } from 'dstnd-io/dist/metadata/game';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
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
    <div style={{ background: colors.neutralLighter }}>
      <GameHistory history={getHistory('')} focusedIndex={2} onRefocus={action('on refocus')} />
    </div>
  </StorybookBaseProvider>
);

export const withLongGame = () => (
  <StorybookBaseProvider>
    <div style={{ background: colors.neutralLighter }}>
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
