import { ChessGameState } from 'dstnd-io';
import { Text } from 'grommet';
import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import { getNewChessGame } from 'src/modules/Games/Chess/lib/sdk';
import splitEvery from 'split-every';
import cx from 'classnames';
import { arrReverse } from 'src/lib/util';

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

export const GameHistory: React.FC<Props> = ({ showRows = 4, ...props }) => {
  const cls = useStyles();
  const gameInstance = useRef(getNewChessGame()).current;
  const [history, setHistory] = useState<ReadableHistory>([]);

  useEffect(() => {
    if (props.game.pgn) {
      gameInstance.load_pgn(props.game.pgn);

      const history = toHistory(gameInstance.history());

      // Set the history in reverse so I can display history scrolled to the end
      //  using flex-direction: 'column-reverse' which reverses it by default
      const historyInReverse = arrReverse(history);

      setHistory(historyInReverse);
    }
  }, [props.game.pgn]);

  return (
    <div className={cx(cls.container, props.className)}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          overflow: 'scroll',
          height: showRows * ROW_HEIGHT,
        }}
      >
        {history.map((pastMove) => (
          <div className={cls.row} key={pastMove.index}>
            <Text className={cx(cls.text, cls.rowIndex)}>{`${pastMove.index}.`}</Text>
            <Text className={cx(cls.text, cls.whiteMove)}>{pastMove.notation[0]}</Text>
            <Text className={cx(cls.text, cls.blackMove)}>{pastMove.notation[1]}</Text>
          </div>
        ))}
      </div>
    </div>
  );
};

const ROW_HEIGHT = 33;

const useStyles = createUseStyles({
  container: {
    flex: 1,
  },
  row: {
    borderWidth: 0,
    borderBottomWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#e0e0e0',
    padding: '4px 8px',
    display: 'flex',

    '&:first-child': {
      borderBottomWidth: 0,
    },
  },
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
