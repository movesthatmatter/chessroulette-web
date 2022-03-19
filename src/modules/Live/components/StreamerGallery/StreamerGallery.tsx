import React from 'react';
import cx from 'classnames';
import { createUseStyles } from 'src/lib/jss';
import { spacers } from 'src/theme/spacers';
import { Streamer } from '../../types';
import { StreamerProfileCard } from '../StreamerProfileCard';

type Props = {
  streamers: Streamer[];
  itemClassName?: string;
  itemsPerRow?: number;
  compact?: boolean;
};

export const StreamerGallery: React.FC<Props> = ({
  streamers,
  itemClassName,
  compact,
  itemsPerRow = 4,
}) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      {streamers.map((streamer) => (
        <StreamerProfileCard
          streamer={streamer}
          containerClassName={cx(cls.card, itemClassName)}
          compact={compact}
          style={{
            width: `calc(${100 / itemsPerRow}% - ${spacers.default})`,
          }}
        />
      ))}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    marginBottom: spacers.default,
    marginRight: spacers.default,
  },
});
