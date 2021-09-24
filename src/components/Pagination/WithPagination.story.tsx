import { AsyncResult, AsyncResultWrapper } from 'ts-async-results';
import { Ok } from 'ts-results';
import { Grommet } from 'grommet';
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { getRandomInt, range } from 'src/lib/util';
import { GameMocker } from 'src/mocks/records';
import { defaultTheme } from 'src/theme';
import { WithPagination } from './WithPagination';
import { Game } from 'src/modules/Games';
import { spacers } from 'src/theme/spacers';

export default {
  component: WithPagination,
  title: 'components/Pagination/WithPagination',
};

const randomChessGameState = (): Game['state'] =>
  (['finished', 'stopped'] as const)[getRandomInt(0, 1)];

const gameMocker = new GameMocker();
// const totalPages = 3;
const itemsTotal = 117;
const items = range(itemsTotal).map(() => gameMocker.record(randomChessGameState()));

export const defaultStory = () => (
  <Grommet theme={defaultTheme}>
    <WithPagination<Game>
      getItems={(p) => {
        console.log('[Action] getItems() Request:', p);

        return new AsyncResultWrapper(() => {
          const itemsSliceFrom = p.pageIndex * p.pageSize;
          const itemsSliceTo = p.pageIndex * p.pageSize + p.pageSize;

          return new Ok({
            items: items.slice(itemsSliceFrom, itemsSliceTo),
            itemsTotal,
            currentIndex: p.pageIndex + 1,
          });
        }).map(
          AsyncResult.passThrough((r) => {
            console.log('[Action] getItems() Response:', r);
          })
        );
      }}
      render={(p) => (
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: spacers.large,
            }}
          >
            {/* rendered */}
            {p.items.map((item) => (
              <div
                key={item.id}
                style={{
                  // background: 'white',
                  borderBottom: '1px solid grey',
                  padding: '16px',
                  borderRadius: '16px',
                }}
              >
                {item.pgn}
              </div>
            ))}
          </div>
          {p.paginator}
        </div>
      )}
    />
  </Grommet>
);
