import { RegisteredUserRecord, GameRecordFinished, GameRecordStopped } from 'dstnd-io';
import React from 'react';
import { createUseStyles, CSSProperties } from 'src/lib/jss';
import { gameRecordToGame } from '../Games/Chess/lib';
import { getUserGames } from './resources';
import { AwesomeLoader } from 'src/components/AwesomeLoader';
import { WithPagination } from 'src/components/Pagination';
import { ArchivedGame } from './components/ArchivedGame';
import { Text } from 'src/components/Text';
import Loader from 'react-loaders';
import { CustomTheme } from 'src/theme';

type Props = {
  userId: RegisteredUserRecord['id'];
  pageSize?: number;
};

export const GamesArchive: React.FC<Props> = ({ userId, pageSize = 10 }) => {
  const cls = useStyles();

  return (
    <WithPagination<GameRecordFinished | GameRecordStopped>
      initialPageSize={pageSize}
      getItems={(p) =>
        getUserGames({
          userId,
          pageSize: p.pageSize,
          currentIndex: p.pageIndex,
        }).map((games) => ({
          items: games.items.map(gameRecordToGame),
          itemsTotal: games.itemsTotal,
          currentIndex: games.currentIndex,
        }))
      }
      render={(r) => {
        return (
          <div className={cls.container}>
            <div className={cls.gameContainerWrapper}>
              {r.items.map((game) => (
                <ArchivedGame game={game} myUserId={userId} key={game.id} />
              ))}
              {r.isEmpty && !r.isLoading && (
                <div className={cls.emptyMessageWrapper}>
                  <Text className={cls.emptyMessage}>You have no games!</Text>
                </div>
              )}
              {r.isLoading && (
                <div className={cls.loadingWrapper}>
                  <Loader type="ball-pulse" active innerClassName={cls.loader} />
                </div>
              )}
            </div>
            {r.isReady && !r.isEmpty && r.paginator}
          </div>
        );
      }}
    />
  );
};

const useStyles = createUseStyles<CustomTheme>(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  gameContainerWrapper: {
    flex: 1,
  },
  loadingWrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    transform: 'scale(.7)',
    ...({
      '& > div': {
        backgroundColor: `${theme.colors.primaryLight} !important`,
      },
    } as CSSProperties['nestedKey']),
  },
  emptyMessageWrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
  },
  emptyMessage: {
    color: theme.colors.neutralDarker,
  },
}));
