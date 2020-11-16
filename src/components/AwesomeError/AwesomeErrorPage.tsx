import React from 'react';
import { createUseStyles } from 'src/lib/jss';
import { AwesomeError, AwesomeErrorProps } from './AwesomeError';

type Props = {
  errorType?: AwesomeErrorProps['errorType'];
};

export const AwesomeErrorPage: React.FC<Props> = (props) => {
  const cls = useStyles();

  return (
    <div className={cls.container}>
      <AwesomeError errorType={props.errorType} />
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
