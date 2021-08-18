import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { spacers } from 'src/theme/spacers';
import { colors, softBorderRadius } from 'src/theme';
import { debounce } from 'debounce';
import { ChessAnalysisHistory } from 'src/modules/Room/RoomActivity/activities/AnalysisActivity/lib';
import { HistoryList, HistoryListProps } from './components/HistoryList';

export type GameHistoryProps = {
  history: ChessAnalysisHistory;
  focusedIndex: HistoryListProps['focusedIndex'];
  onRefocus: HistoryListProps['onRefocus'];

  className?: string;

  // @deprecated
  showRows?: number;
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
  // const [pairedHistory, setPairedHistory] = useState<PairedHistory>([]);
  // const [focus, setFocus] = useState<PairedIndex>([0, 0]);
  // const rowElementRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // console.log(JSON.stringify(history, null, 2));

  return (
    <div className={cls.container}>
      <div className={cx(cls.main, props.className)}>
        <div className={cls.spacer} />
        {/* <div className={cls.content}> */}
        <HistoryList
          history={history}
          focusedIndex={focusedIndex}
          onRefocus={onRefocus}
          className={cls.content}
        />
        {/* </div> */}
      </div>
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
    // paddingTop: spacers.default,
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
});
