import React from 'react';
import { useHistory } from 'react-router-dom';
import { createUseStyles } from 'src/lib/jss';
import { AwesomeError, AwesomeErrorProps } from './AwesomeError';

type Props = {
  errorType?: AwesomeErrorProps['errorType'];
  popup? :boolean;
};

export const AwesomeErrorPage: React.FC<Props> = (props) => {
  const cls = useStyles();
  const history = useHistory();
  
  return (
    <div className={cls.container}>
      <AwesomeError errorType={props.errorType} popup onClear={() => history.push('/')}/>
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
