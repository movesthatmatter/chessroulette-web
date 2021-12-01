import React from 'react';
import { createUseStyles } from 'src/lib/jss';

type Props = {};

export const PromoGameDisplay: React.FC<Props> = (props) => {
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