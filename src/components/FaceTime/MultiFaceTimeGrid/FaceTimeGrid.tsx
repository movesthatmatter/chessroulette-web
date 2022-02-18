import React from 'react';
import { createUseStyles } from 'src/lib/jss';

type Props = {
  // reel: Streamer[];
  // onClick: (userId: Streamer['user']['id']) => void;

  // containerClassName?: string;
  // itemClassName?: string;
};

export const FaceTimeGrid: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      works
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
});