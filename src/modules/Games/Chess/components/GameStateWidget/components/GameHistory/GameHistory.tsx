import { ChessGameState } from 'dstnd-io';
import { Text } from 'src/components/Text';
import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { getNewChessGame } from 'src/modules/Games/Chess/lib/sdk';
import splitEvery from 'split-every';
import cx from 'classnames';
import { arrReverse } from 'src/lib/util';
import { Emoji } from 'src/components/Emoji';
import capitalize from 'capitalize';
import { otherChessColor } from 'src/modules/Games/Chess/util';
import { Box } from 'grommet';
import { CSSProperties } from 'src/lib/jss/types';

type Props = {
  game: ChessGameState;
  className?: string;
  showRows?: number;
};

type PastMove = {
  index: number;
  notation: [string] | [string, string];
};
type ReadableHistory = PastMove[];

const toHistory = (moves: string[]): ReadableHistory =>
  splitEvery(2, moves).map((notation: PastMove['notation'], index: number) => ({
    notation,
    index: index + 1,
  }));

export const GameHistory: React.FC<Props> = ({ showRows = 4, game, ...props }) => {
  const cls = useStyles();
  const gameInstance = useRef(getNewChessGame()).current;
  const [history, setHistory] = useState<ReadableHistory>([]);

  useEffect(() => {
    if (game.pgn) {
      gameInstance.load_pgn(game.pgn);

      const history = toHistory(gameInstance.history());

      // Set the history in reverse so I can display history scrolled to the end
      //  using flex-direction: 'column-reverse' which reverses it by default
      const historyInReverse = arrReverse(history);

      setHistory(historyInReverse);
    }
  }, [game.pgn]);

  return (
    <div className={cx(cls.container, props.className)}>
      <div className={cls.spacer} />
      <div className={cls.content}>
        {game.state !== 'started' ? (
          <div className={cx(cls.row, game.state === 'pending' ? cls.initStateRow : cls.resultRow)}>
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
        ) : (
          <Box
            className={cls.row}
            alignContent="center"
            align="center"
            justify="center"
            fill
            pad="small"
          />
        )}
        {history.map((pastMove) => (
          <div className={cls.row} key={pastMove.index}>
            <Text className={cx(cls.text, cls.rowIndex)}>{`${pastMove.index}.`}</Text>
            <Text className={cx(cls.text, cls.whiteMove)}>{pastMove.notation[0]}</Text>
            <Text className={cx(cls.text, cls.blackMove)}>{pastMove.notation[1]}</Text>
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
    overflowY: 'scroll',
  },
  row: {
    borderWidth: 0,
    borderBottomWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#e0e0e0',
    padding: '4px 8px',
    display: 'flex',

    ...{
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
    } as CSSProperties,
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
  whiteMove: {
    flex: 1,
    fontWeight: 300,
  },
  blackMove: {
    flex: 1,
    fontWeight: 300,
  },
});
