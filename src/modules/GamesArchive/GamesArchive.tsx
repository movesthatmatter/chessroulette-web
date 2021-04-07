import { RegisteredUserRecord, GameRecordFinished, GameRecordStopped } from 'dstnd-io';
import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { gameRecordToGame } from '../Games/Chess/lib';
import { getUserGames } from './resources';
import { AwesomeLoader } from 'src/components/AwesomeLoader';
import { WithPagination } from 'src/components/Pagination';
import { ArchivedGame } from './components/ArchivedGame';

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
        }).map((games) => {
          return {
            items: games.items.map(gameRecordToGame),
            itemsTotal: games.itemsTotal,
            currentIndex: games.currentIndex,
          };
        })
      }
      render={(r) => {
        if (r.isLoading) {
          return <AwesomeLoader />;
        }

        return (
          <div className={cls.container}>
            <div className={cls.gameContainerWrapper}>
              {r.items.map((game) => (
                <ArchivedGame game={game} />
              ))}
            </div>
            {r.paginator}
          </div>
        );
      }}
    />
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  gameContainerWrapper: {
    flex: 1,
  },
});
