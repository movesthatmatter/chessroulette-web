import React from 'react';
import config from 'src/config';
import { createUseStyles } from 'src/lib/jss';
import { Page, PageProps } from '../Page';
import { AwesomeError, AwesomeErrorProps } from './AwesomeError';

type Props = {
  errorType?: AwesomeErrorProps['errorType'];
  stretched?: PageProps['stretched'];
};

export const AwesomeErrorPage: React.FC<Props> = ({ errorType, stretched }) => {
  const cls = useStyles();

  return (
    <Page name={config.TITLE_SUFFIX} stretched={stretched}>
      <div className={cls.container}>
        <div style={{ width: '300px' }}>
          <AwesomeError errorType={errorType} />
        </div>
      </div>
    </Page>
  );
};

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});
