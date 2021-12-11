import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { noop } from 'src/lib/util';
import { CuratedEvent } from '../../types';

type Props = {
  event: CuratedEvent;
  onClick?: (ce: CuratedEvent) => void;
};

export const EventDisplay: React.FC<Props> = ({ event, onClick = noop }) => {
  const cls = useStyles();

  return (
    <div className={cls.container} onClick={() => onClick(event)}>
      {event.name}
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
});
