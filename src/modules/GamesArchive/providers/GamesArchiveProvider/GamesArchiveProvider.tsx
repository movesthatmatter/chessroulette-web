import { GameRecordFinished, GameRecordStopped, UserRecord } from 'dstnd-io';
import React from 'react';
import { WithPagination } from 'src/components/Pagination';
import { gameRecordToGame } from 'src/modules/Games/Chess/lib';
import { getUserGames } from '../../resources';

type Props = {
  pageSize: number;
  userId: UserRecord['id'];
  rowClassName?: string;
  render: (p: {
    games: (GameRecordFinished | GameRecordStopped)[];
    isLoading: boolean;
    isEmpty: boolean;
    isReady: boolean;
    pageSize: number;
    pageIndex: number;
    totalPages: number;
  }) => React.ReactNode;
};

export const GamesArchiveProvider: React.FC<Props> = ({ pageSize, userId, render }) => {
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
      render={(r) =>
        render({
          ...r,
          games: r.items,
        })
      }
    />
  );
};
