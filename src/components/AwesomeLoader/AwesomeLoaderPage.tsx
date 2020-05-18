import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { AwesomeLoader } from './AwesomeLoader';

type Props = {};

export const AwesomeLoaderPage: React.FC<Props> = () => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <AwesomeLoader />
    </div>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});
