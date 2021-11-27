import React from 'react';
import Loader from 'react-loaders';
import { Text } from 'src/components/Text';
import { ISODateTimeToTimestamp } from 'src/lib/date';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { renderMatch } from 'src/lib/renderMatch';
import { CompactGameList } from 'src/modules/Games/Chess/components/GamesList/components/CompactGameList';
import { RelayedGame } from '../types';
import { RelayedGameProvider } from './RelayedGameProvider';

type Props = {
  onSelect: (g: RelayedGame) => void;
};

export const RelayLiveGameList: React.FC<Props> = ({ onSelect }) => {
  const cls = useStyles();

  return (
    <RelayedGameProvider
      pageSize={20}
      render={({ isLoading, relayedGames, isEmpty }) =>
        renderMatch(
          () => (
            <CompactGameList
              games={relayedGames
                .map(({ game }) => game)
                .sort(
                  (g1, g2) =>
                    ISODateTimeToTimestamp(g1.createdAt) - ISODateTimeToTimestamp(g2.createdAt)
                ).reverse()}
              onSelect={(_, index) => onSelect(relayedGames[index])}
              selectText="Analyze Live"
              hasClipboardCopy={false}
            />
          ),
          [isLoading, () => <Loader type="ball-pulse" active innerClassName={cls.loader} />],
          [isEmpty, () => <Text size="small1">Wow So Empty</Text>]
        )
      }
    />
  );
};

const useStyles = createUseStyles((theme) => ({
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transform: 'scale(.7)',
    ...({
      '& > div': {
        backgroundColor: theme.colors.primary,
      },
    } as CSSProperties),
  },
}));
