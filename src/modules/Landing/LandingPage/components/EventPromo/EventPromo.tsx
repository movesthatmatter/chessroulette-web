import React from 'react';
import { FloatingBox } from 'src/components/FloatingBox';
import { createUseStyles } from 'src/lib/jss';
import cx from 'classnames';
import { ISODateTime } from 'io-ts-isodatetime';
import { Text } from 'src/components/Text';
import { AwesomeCountdown } from 'src/components/AwesomeCountdown/AwesomeCountdown';
import { noop } from 'src/lib/util';
import { colors } from 'src/theme/colors';
import { GameRecord } from 'dstnd-io';
import { ChessGameDisplay } from 'src/modules/Games/widgets/ChessGameDisplay';
import { Game } from 'src/modules/Games';
import { createAnalysis } from 'src/modules/Activity/resources';
import { useHistory } from 'react-router-dom';
import { softBorderRadius } from 'src/theme';
import { spacers } from 'src/theme/spacers';
import { CompactGameListItem } from 'src/modules/Games/Chess/components/GamesList/components/CompactGameListItem';

type Props = {
  classname?: string;
  event: {
    name: string;
    startDate?: ISODateTime;
  };
  onCountdownTimeEnded?: (tickIntervalMs: number) => void;

  game?: Game;
};

export const EventPromo: React.FC<Props> = ({ onCountdownTimeEnded = noop, ...props }) => {
  const cls = useStyles();
  const history = useHistory();

  return (
    <FloatingBox className={cx(cls.container, props.classname)}>
      <Text size="title2" className={cls.text}>
        {props.event.name}
      </Text>
      {props.game ? (
        <>
          <div style={{ height: spacers.large }} />
          <CompactGameListItem game={props.game} />
          {/* <ChessGameDisplay
            game={props.game}
            className={cls.board}
            onClick={() => {
              if (!props.game) {
                return;
              }

              createAnalysis({
                source: 'archivedGame',
                gameId: props.game.id,
              }).map((analysis) => {
                history.push(`/analyses/${analysis.id}`);
              });
            }}
          /> */}
        </>
      ) : (
        <>
          {props.event.startDate && (
            <AwesomeCountdown
              deadline={props.event.startDate}
              fontSizePx={50}
              onTimeEnded={onCountdownTimeEnded}
              className={cls.countdownContainer}
            />
          )}
        </>
      )}
    </FloatingBox>
  );
};

const useStyles = createUseStyles({
  container: {
    backgroundImage: `linear-gradient(45deg, ${colors.light.primary} 0, ${colors.dark.primary} 150%)`,
  },
  countdownContainer: {
    color: colors.universal.white,
  },
  text: {
    color: colors.universal.white,
  },

  board: {
    ...softBorderRadius,
    overflow: 'hidden',
  },
});
