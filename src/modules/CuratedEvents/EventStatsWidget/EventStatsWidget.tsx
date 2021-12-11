import React, { useMemo } from 'react';
import cx from 'classnames';
import { FloatingBox } from 'src/components/FloatingBox';
import { Text } from 'src/components/Text';
import { createUseStyles } from 'src/lib/jss';
import { CuratedEvent } from '../types';
import { getCuratedEventStats } from '../util/stats';
import { UserDisplay } from 'src/components/UserDisplay';
import { spacers } from 'src/theme/spacers';
import { ScrollableList } from 'src/components/ScrollableList';

type Props = {
  event: CuratedEvent;
  className?: string;
};

export const EventStatsWidget: React.FC<Props> = ({ event, className }) => {
  const cls = useStyles();
  const stats = useMemo(() => getCuratedEventStats(event), [event]);

  return (
    <FloatingBox className={cx(cls.container)}>
      {/* <Text size="subtitle1">Leaderboard</Text> */}
      {/* <br />
      <br /> */}
      <ScrollableList
        className={cx(cls.list, className)}
        items={stats.leaderboard.map((playerAndScore, index) => ({
          id: playerAndScore.playerId,
          content: (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                flex: 1,
                width: '100%',
                marginBottom: spacers.default,
                alignItems: 'center',
              }}
            >
              <div className={cls.pos}>
                <Text className={cls.pos}>{index + 1}</Text>
              </div>
              <UserDisplay user={stats.players[playerAndScore.playerId]} />
              <Text>{playerAndScore.score} pts</Text>
            </div>
          ),
        }))}
      />
    </FloatingBox>
  );
};

const useStyles = createUseStyles({
  container: {},
  pos: {
    width: spacers.larger,
  },
  list: {
    height: '100%',
  },
});
