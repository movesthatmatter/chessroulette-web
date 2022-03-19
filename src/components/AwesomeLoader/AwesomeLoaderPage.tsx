import React from 'react';
import DocumentTitle from 'react-document-title';
import config from 'src/config';
import { createUseStyles } from 'src/lib/jss';
import { AwesomeLoader } from './AwesomeLoader';

type Props = {};

export const AwesomeLoaderPage: React.FC<Props> = () => {
  const cls = useStyles();

  return (
    <DocumentTitle title={config.TITLE_SUFFIX}>
      <div className={cls.container}>
        <div style={{ width: '300px' }}>
          <AwesomeLoader />
        </div>
      </div>
    </DocumentTitle>
  );
};

const useStyles = createUseStyles((theme) => ({
  container: {
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    color: theme.text.baseColor,
  },
}));
