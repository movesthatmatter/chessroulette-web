import { ChessGameState } from 'dstnd-io';
import { Text } from 'src/components/Text';
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { arrReverse, keyInObject, noop } from 'src/lib/util';
import { Emoji } from 'src/components/Emoji';
import capitalize from 'capitalize';
import { Box } from 'grommet';
import { CSSProperties } from 'src/lib/jss/types';
import {
  PairedIndex,
  PairedHistory,
  toPairedHistory,
  linearToPairedIndex,
  pairedToLinearIndex,
  reversedLinearIndex,
  pairedHistoryToHistory,
} from '../../lib';
import useEventListener from '@use-it/event-listener';
import { otherChessColor } from 'dstnd-io/dist/chessGame/util/util';

type Props = {
  game: ChessGameState;
  className?: string;
  showRows?: number;
  focusedIndex?: number;
  onFocusedIndexChanged? (nextIndex: number): void;
};

export const GameHistory: React.FC<Props> = ({
  game,
  showRows = 4,
  focusedIndex = 0,
  onFocusedIndexChanged = noop,
  ...props
}) => {
  const cls = useStyles();
  const [pairedHistory, setPairedHistory] = useState<PairedHistory>([]);
  const [focus, setFocus] = useState<PairedIndex>([0, 0]);

  useEffect(() => {
    if (game.history) {
      const pairedHistory = toPairedHistory(game.history);

      // Set the history in reverse so I can display history scrolled to the end
      //  using flex-direction: 'column-reverse' which reverses it by default
      const historyInReverse = arrReverse(pairedHistory);

      setPairedHistory(historyInReverse);
      setFocus(linearToPairedIndex(game.history, focusedIndex));
    } else {
      setPairedHistory([]);
    }
  }, [game.history, focusedIndex]);

  useEventListener('keydown', (event: object) => {
    if (!keyInObject(event, 'key')) {
      return;
    }

    if (!game.history) {
      return;
    }

    if (event.key === 'ArrowRight') {
      if (focusedIndex > 0) {
        onFocusedIndexChanged(focusedIndex - 1);
      }
    } else if (event.key === 'ArrowLeft') {
      if (focusedIndex < game.history.length - 1) {
        onFocusedIndexChanged(focusedIndex + 1);
      }
    }
  });

  return (
    <div className={cx(cls.container, props.className)}>
      <div className={cls.spacer} />
      <div className={cls.content}>
        {game.state !== 'started' ? (
          <>
            <div
              className={cx(cls.row, game.state === 'pending' ? cls.initStateRow : cls.resultRow)}
            >
              <Box alignContent="center" align="center" justify="center" fill pad="small">
                <Text size="small1" className={cls.text}>
                  {game.state === 'finished' && (
                    <>
                      {game.winner === '1/2' ? (
                        'Game Ended in a Draw by Stalemate!'
                      ) : (
                        <>
                          {`${capitalize(game.winner)} won! `}
                          <Text>
                            <Emoji symbol="🎉" />
                          </Text>
                        </>
                      )}
                    </>
                  )}
                  {game.state === 'stopped' && (
                    <>
                      {game.winner === '1/2'
                        ? 'Game Ended in a Draw!'
                        : `${capitalize(otherChessColor(game.winner))} resigned!`}
                    </>
                  )}
                  {game.state === 'neverStarted' && 'Game Aborted!'}
                  {game.state === 'pending' && 'Game Not Started!'}
                </Text>
              </Box>
            </div>
            {game.state !== 'pending' && <div className={cls.filler} />}
          </>
        ) : (
          <div className={cls.filler} />
        )}
        {pairedHistory.map((pairedMove, index) => (
          <div className={cls.row} key={index}>
            <Text className={cx(cls.text, cls.rowIndex)}>{`${pairedHistory.length - index}.`}</Text>
            <Text
              className={cx(cls.text, cls.move, cls.whiteMove, {
                [cls.activeMove]: focus[0] === pairedHistory.length - index - 1 && focus[1] === 0,
              })}
              onClick={() => {
                const nextIndex = reversedLinearIndex(
                  pairedHistoryToHistory(pairedHistory),
                  pairedToLinearIndex([pairedHistory.length - index - 1, 0])
                );
                onFocusedIndexChanged(nextIndex);
              }}
            >
              {pairedMove[0].san}
            </Text>
            <Text
              className={cx(cls.text, cls.move, cls.blackMove, {
                [cls.activeMove]: focus[0] === pairedHistory.length - index - 1 && focus[1] === 1,
              })}
              onClick={() => {
                const nextIndex = reversedLinearIndex(
                  pairedHistoryToHistory(pairedHistory),
                  pairedToLinearIndex([pairedHistory.length - index - 1, 1])
                );
                onFocusedIndexChanged(nextIndex);
              }}
            >
              {pairedMove[1]?.san}
            </Text>
          </div>
        ))}
      </div>
      <div className={cls.spacer} />
    </div>
  );
};

const ROW_HEIGHT = 33;

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    height: '100%',

    paddingLeft: '16px',
    paddingRight: '16px',
    flexDirection: 'column',
  },
  spacer: {
    height: '16px',
  },
  content: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column-reverse',
    overflowY: 'auto',
  },
  row: {
    borderWidth: 0,
    borderBottomWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#e0e0e0',
    padding: '4px 8px',
    display: 'flex',

    ...({
      '&:first-child': {
        borderBottomWidth: 0,
        paddingBottom: 0,
      },
      '&:nth-child(2)': {
        borderBottomWidth: 0,
        paddingBottom: 0,
      },
      '&:last-child': {
        paddingTop: 0,
      },
    } as CSSProperties),
  },
  initStateRow: {
    flex: 1,
  },
  resultRow: {},
  text: {
    fontSize: '14px',
  },
  rowIndex: {
    paddingRight: '16px',
  },
  move: {
    cursor: 'pointer',
  },
  whiteMove: {
    flex: 1,
    fontWeight: 300,
  },
  blackMove: {
    flex: 1,
    fontWeight: 300,
  },
  filler: {
    flex: 1,
  },
  activeMove: {
    fontWeight: 800,
  },
});
