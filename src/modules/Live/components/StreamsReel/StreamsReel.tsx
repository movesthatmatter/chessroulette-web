import React from 'react';
import cx from 'classnames';
import { createUseStyles } from 'src/lib/jss';
import { noop } from 'src/lib/util';
import { LiveStreamer } from '../../types';
import { LiveStreamCard } from '../LiveStreamCard/LiveStreamCard';
import { spacers } from 'src/theme/spacers';

type Props = {
  streamers: LiveStreamer[];
  containerClassName?: string;
  itemClassName?: string;
  onItemClick?: (s: LiveStreamer) => void;
};

export const StreamsReel: React.FC<Props> = ({
  streamers,
  containerClassName,
  itemClassName,
  onItemClick = noop,
}) => {
  const cls = useStyles();

  return (
    <div className={cx(containerClassName)}>
      <div className={cls.wrapper}>
        {streamers.map((streamer) => (
          <LiveStreamCard
            key={streamer.id}
            streamer={streamer}
            containerClassName={cx(cls.card, itemClassName)}
            onClick={() => onItemClick(streamer)}
          />
        ))}
      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  wrapper: {
    width: `calc(100% + ${spacers.large})`,
    marginLeft: `-${spacers.large}`,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    display: 'flex',
    marginLeft: spacers.large,
    marginBottom: spacers.large,
  },
});
