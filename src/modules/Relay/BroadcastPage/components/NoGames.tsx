import React from 'react';
import { createUseStyles } from 'src/lib/jss';

type Props = {};

export const NoGames: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <div>There are currently no live games being broadcast.</div>
    </div>
  );
};

const useStyles = createUseStyles({
  container: {},
});