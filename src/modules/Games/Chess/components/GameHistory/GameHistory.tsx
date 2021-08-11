import { Text } from 'src/components/Text';
import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
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
import { Game } from 'src/modules/Games/types';
import { spacers } from 'src/theme/spacers';
import { colors, softBorderRadius } from 'src/theme';
import { debounce } from 'debounce';

export type GameHistoryProps = {
  history: Game['history'];
  focusedIndex: number;
  onRefocus: (nextIndex: number) => void;
  
  showRows?: number;
  className?: string;
};

const scrollIntoView = debounce((elm: HTMLDivElement) => {
  elm.scrollIntoView({ block: 'end', behavior: 'smooth' });
}, 50);

export const GameHistory: React.FC<GameHistoryProps> = ({
  history = [],
  showRows = 4,
  focusedIndex,
  onRefocus,
  ...props
}) => {
  const cls = useStyles();
  const [pairedHistory, setPairedHistory] = useState<PairedHistory>([]);
  const [focus, setFocus] = useState<PairedIndex>([0, 0]);
  const rowElementRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    if (history) {
      setPairedHistory(toPairedHistory(history));
      setFocus(linearToPairedIndex(history, focusedIndex));

      const currentRowElm = rowElementRefs.current[linearToPairedIndex(history, focusedIndex)[0]];
      if (currentRowElm) {
        scrollIntoView(currentRowElm);
      }
    } else {
      setPairedHistory([]);
    }
  }, [history, focusedIndex]);

  return (
    <div className={cls.container}>
      <div className={cx(cls.main, props.className)}>
        <div className={cls.spacer} />
        <div className={cls.content}>
          {/* {game.state !== 'started' ? (
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
        )} */}
          {pairedHistory.map((pairedMove, index) => (
            <div className={cls.row} key={index} ref={(b) => (rowElementRefs.current[index] = b)}>
              <Text className={cx(cls.text, cls.rowIndex)}>{`${index + 1}.`}</Text>
              <Text
                className={cx(cls.text, cls.move, cls.whiteMove, {
                  [cls.activeMove]: focus[0] === index && focus[1] === 0,
                })}
                onClick={() => {
                  const nextIndex = reversedLinearIndex(
                    pairedHistoryToHistory(pairedHistory),
                    pairedToLinearIndex([index, 0])
                  );
                  onRefocus(nextIndex);
                }}
              >
                {pairedMove[0].san}
              </Text>
              <Text
                className={cx(cls.text, cls.move, cls.blackMove, {
                  [cls.activeMove]: focus[0] === index && focus[1] === 1,
                })}
                onClick={() => {
                  const nextIndex = reversedLinearIndex(
                    pairedHistoryToHistory(pairedHistory),
                    pairedToLinearIndex([index, 1])
                  );
                  onRefocus(nextIndex);
                }}
              >
                {pairedMove[1]?.san}
              </Text>
            </div>
          ))}
        </div>
        {/* <div className={cls.spacer} /> */}
      </div>
      {/* <Graphic homePercent={percent} /> */}
      {/* <div className={cls.side}>

      </div> */}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    height: '100%',
    // background: 'red',
  },
  main: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    flex: 1,
    // paddingRight: '10px',
    // marginRight: spacers.small,
  },
  side: {
    display: 'flex',
    height: '100%',
    // background: 'red',
    width: '10px',
    marginLeft: '-10px',
    ...softBorderRadius,
    // backgroundImage: 'linearGradient(to bottom, )',
    background: `linear-gradient(${colors.negativeLight}, ${colors.primary})`,
    opacity: 0.7,
  },
  spacer: {
    height: spacers.default,
  },
  content: {
    display: 'flex',
    flex: 1,
    paddingLeft: spacers.default,
    paddingRight: spacers.default,
    flexDirection: 'column',
    overflowY: 'auto',
  },
  row: {
    borderWidth: 0,
    borderBottomWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#e0e0e0',
    padding: `${spacers.small} ${spacers.small}`,
    display: 'flex',
    ...({
      '&:first-child': {
        paddingTop: 0,
      },
      '&:last-child': {
        // paddingBottom: 0,
        borderBottomWidth: 0,
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
    paddingRight: spacers.default,
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
